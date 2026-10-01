// ==================== AUTO MOD HANDLER ====================

const autoModCache = new Map();

function getCache(guildId, userId, type) {
    const key = `${guildId}-${userId}-${type}`;
    if (!autoModCache.has(key)) autoModCache.set(key, []);
    return autoModCache.get(key);
}

async function checkAutoMod(message, config) {
    try {
        if (!config.autoMod) return false;
        if (!message.guild) return false;
        if (message.author.bot) return false;

        if (config.whitelist && config.whitelist.users && config.whitelist.users.all) {
            if (config.whitelist.users.all.includes(message.author.id)) return false;
        }
        if (config.whitelist && config.whitelist.roles && config.whitelist.roles.all) {
            if (message.member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return false;
        }

        // سپام
        if (config.autoMod.spam && config.autoMod.spam.enabled) {
            const now = Date.now();
            const tracker = getCache(message.guild.id, message.author.id, 'spam');
            tracker.push(now);
            const window = config.autoMod.spam.window || 5000;
            const valid = tracker.filter(t => now - t < window);
            autoModCache.set(`${message.guild.id}-${message.author.id}-spam`, valid);

            if (valid.length >= (config.autoMod.spam.threshold || 5)) {
                autoModCache.set(`${message.guild.id}-${message.author.id}-spam`, []);
                return true;
            }
        }

        // دووبارەکردنەوە
        if (config.autoMod.duplicates && config.autoMod.duplicates.enabled) {
            if (message.channel.messages) {
                const fetched = await message.channel.messages.fetch({ limit: 5 }).catch(() => null);
                if (fetched) {
                    const previous = fetched.filter(m => m.author.id === message.author.id && m.id !== message.id);
                    const duplicates = previous.filter(m => m.content.toLowerCase() === message.content.toLowerCase());
                    if (duplicates.size >= (config.autoMod.duplicates.threshold || 3) - 1) {
                        return true;
                    }
                }
            }
        }

        // ئیمۆجی
        if (config.autoMod.emoji && config.autoMod.emoji.enabled) {
            const emojiRegex = /<a?:.+?:\d+>|[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu;
            const matches = message.content.match(emojiRegex) || [];
            if (matches.length > (config.autoMod.emoji.max || 10)) return true;
        }

        // مێنشن
        if (config.autoMod.mentions && config.autoMod.mentions.enabled) {
            if (message.mentions.users.size > (config.autoMod.mentions.max || 5)) return true;
        }

        // کەپس
        if (config.autoMod.caps && config.autoMod.caps.enabled) {
            const content = message.content;
            if (content.length >= 8) {
                const capsCount = content.replace(/[^A-Z]/g, '').length;
                const totalLetters = content.replace(/[^A-Za-z]/g, '').length;
                if (totalLetters > 0) {
                    const capsPercentage = (capsCount / totalLetters) * 100;
                    if (capsPercentage >= (config.autoMod.caps.max || 70)) return true;
                }
            }
        }

        // زالگۆ
        if (config.autoMod.zalgo && config.autoMod.zalgo.enabled) {
            const zalgoRegex = /[\u0300-\u036f\u0489]/g;
            if (zalgoRegex.test(message.content)) return true;
        }

        // دووبارەبوونەوەی پیت
        if (config.autoMod.charRepeat && config.autoMod.charRepeat.enabled) {
            const repeatRegex = /(.)\1{9,}/g;
            if (repeatRegex.test(message.content)) return true;
        }

        // فیشینگ
        if (config.autoMod.phishing && config.autoMod.phishing.enabled) {
            const phishingDomains = ['discord-gift', 'discordnitro', 'free-nitro', 'steamcommunity.ru', 'gift-discord', 'nitro-gift', 'discordapp.gift', 'nitro-free'];
            const hasPhishing = phishingDomains.some(d => message.content.toLowerCase().includes(d));
            if (hasPhishing) return true;
        }

        // وشە قەدەغەکراوەکان
        if (config.autoMod.bannedWords && config.autoMod.bannedWords.enabled) {
            const words = config.autoMod.bannedWords.words || [];
            const content = message.content.toLowerCase();
            if (words.some(w => content.includes(w.toLowerCase()))) return true;
        }

        // بانگهێشت
        if (config.autoMod.invites && config.autoMod.invites.enabled) {
            const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite|discord\.com\/invite)\/[a-zA-Z0-9]+/i;
            if (inviteRegex.test(message.content)) return true;
        }

        // لینک
        if (config.autoMod.links && config.autoMod.links.enabled) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = message.content.match(urlRegex);
            if (urls) {
                const allowed = config.autoMod.links.allowedDomains || [];
                const hasBlocked = urls.some(url => {
                    try {
                        const domain = new URL(url).hostname.replace('www.', '');
                        return !allowed.some(a => domain.includes(a));
                    } catch (e) {
                        return true;
                    }
                });
                if (hasBlocked) return true;
            }
        }

        // زانیاری کەسی
        if (config.autoMod.personalInfo && config.autoMod.personalInfo.enabled) {
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
            const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
            if (emailRegex.test(message.content) || phoneRegex.test(message.content) || ipRegex.test(message.content)) return true;
        }

        // مێنشنی بەکۆمەڵ
        if (config.autoMod.massMention && config.autoMod.massMention.enabled) {
            const mentionCount = message.mentions.users.size + message.mentions.roles.size;
            if (mentionCount >= (config.autoMod.massMention.max || 10)) return true;
        }

        return false;
    } catch (e) {
        console.error(`checkAutoMod Error: ${e.message}`);
        return false;
    }
}

module.exports = {
    checkAutoMod
};
