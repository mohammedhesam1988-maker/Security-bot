// ==================== ANTI-SPAM HANDLER ====================

const userMessages = new Map();
const voiceCache = new Map();

function isWhitelisted(message, config) {
    if (config.whitelist && config.whitelist.users && config.whitelist.users.all) {
        if (config.whitelist.users.all.includes(message.author.id)) return true;
    }
    if (config.whitelist && config.whitelist.roles && config.whitelist.roles.all) {
        if (message.member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return true;
    }
    return false;
}

async function punish(message, settings, reason) {
    const punishment = settings.punishment || 'delete';
    const duration = settings.timeoutDuration || 60000;

    try {
        if (punishment === 'delete') {
            await message.delete().catch(() => {});
        } else if (punishment === 'timeout') {
            await message.delete().catch(() => {});
            if (message.member && message.member.moderatable) {
                await message.member.timeout(duration, reason).catch(() => {});
            }
        } else if (punishment === 'kick') {
            await message.delete().catch(() => {});
            if (message.member && message.member.kickable) {
                await message.member.kick(reason).catch(() => {});
            }
        } else if (punishment === 'ban') {
            await message.delete().catch(() => {});
            if (message.member && message.member.bannable) {
                await message.member.ban({ reason }).catch(() => {});
            }
        } else if (punishment === 'warn') {
            await message.delete().catch(() => {});
            await message.channel.send(`⚠️ ${message.author}, ${reason}`).then(msg => {
                setTimeout(() => msg.delete().catch(() => {}), 5000);
            }).catch(() => {});
        }
    } catch (e) {
        console.error(`Punish Error: ${e.message}`);
    }
}

// ==================== CHECK SPAM ====================
async function checkSpam(message, config) {
    if (!config.autoMod || !config.autoMod.spam || !config.autoMod.spam.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const settings = config.autoMod.spam;
    const key = `${message.guild.id}-${message.author.id}`;
    const now = Date.now();

    if (!userMessages.has(key)) userMessages.set(key, []);
    const timestamps = userMessages.get(key);
    timestamps.push(now);

    const window = settings.window || 5000;
    const validTimestamps = timestamps.filter(t => now - t < window);
    userMessages.set(key, validTimestamps);

    if (validTimestamps.length >= (settings.threshold || 5)) {
        await punish(message, settings, 'Spam detected');
        userMessages.set(key, []);
        return true;
    }
    return false;
}

// ==================== CHECK INVITES ====================
async function checkInvites(message, config) {
    if (!config.autoMod || !config.autoMod.invites || !config.autoMod.invites.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite|discord\.com\/invite)\/[a-zA-Z0-9]+/i;
    if (inviteRegex.test(message.content)) {
        await punish(message, config.autoMod.invites, 'Invite links are not allowed');
        return true;
    }
    return false;
}

// ==================== CHECK LINKS ====================
async function checkLinks(message, config) {
    if (!config.autoMod || !config.autoMod.links || !config.autoMod.links.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.content.match(urlRegex);
    if (!urls) return false;

    const allowed = config.autoMod.links.allowedDomains || [];
    const hasBlocked = urls.some(url => {
        try {
            const domain = new URL(url).hostname.replace('www.', '');
            return !allowed.some(a => domain.includes(a));
        } catch (e) {
            return true;
        }
    });

    if (hasBlocked) {
        await punish(message, config.autoMod.links, 'Links are not allowed');
        return true;
    }
    return false;
}

// ==================== CHECK PHISHING ====================
async function checkPhishing(message, config) {
    if (!config.autoMod || !config.autoMod.phishing || !config.autoMod.phishing.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const phishingDomains = ['discord-gift', 'discordnitro', 'free-nitro', 'steamcommunity.ru', 'gift-discord', 'nitro-gift', 'discordapp.gift', 'nitro-free'];
    const hasPhishing = phishingDomains.some(d => message.content.toLowerCase().includes(d));

    if (hasPhishing) {
        await punish(message, config.autoMod.phishing, 'Phishing link detected');
        return true;
    }
    return false;
}

// ==================== CHECK BANNED WORDS ====================
async function checkBannedWords(message, config) {
    if (!config.autoMod || !config.autoMod.bannedWords || !config.autoMod.bannedWords.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const words = config.autoMod.bannedWords.words || [];
    const content = message.content.toLowerCase();

    if (words.some(w => content.includes(w.toLowerCase()))) {
        await punish(message, config.autoMod.bannedWords, 'Banned word detected');
        return true;
    }
    return false;
}

// ==================== CHECK CAPS ====================
async function checkCaps(message, config) {
    if (!config.autoMod || !config.autoMod.caps || !config.autoMod.caps.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const content = message.content;
    if (content.length < 8) return false;

    const capsCount = content.replace(/[^A-Z]/g, '').length;
    const totalLetters = content.replace(/[^A-Za-z]/g, '').length;
    if (totalLetters === 0) return false;

    const capsPercentage = (capsCount / totalLetters) * 100;
    if (capsPercentage >= (config.autoMod.caps.max || 70)) {
        await punish(message, config.autoMod.caps, 'Too many caps');
        return true;
    }
    return false;
}

// ==================== CHECK EMOJI ====================
async function checkEmoji(message, config) {
    if (!config.autoMod || !config.autoMod.emoji || !config.autoMod.emoji.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const emojiRegex = /<a?:.+?:\d+>|[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu;
    const matches = message.content.match(emojiRegex) || [];

    if (matches.length > (config.autoMod.emoji.max || 10)) {
        await punish(message, config.autoMod.emoji, 'Too many emojis');
        return true;
    }
    return false;
}

// ==================== CHECK MENTIONS ====================
async function checkMentions(message, config) {
    if (!config.autoMod || !config.autoMod.mentions || !config.autoMod.mentions.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    if (message.mentions.users.size > (config.autoMod.mentions.max || 5)) {
        await punish(message, config.autoMod.mentions, 'Too many mentions');
        return true;
    }
    return false;
}

// ==================== CHECK DUPLICATES ====================
async function checkDuplicates(message, config) {
    if (!config.autoMod || !config.autoMod.duplicates || !config.autoMod.duplicates.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    if (!message.channel.messages) return false;

    try {
        const fetched = await message.channel.messages.fetch({ limit: 5 });
        const previous = fetched.filter(m => m.author.id === message.author.id && m.id !== message.id);
        const duplicates = previous.filter(m => m.content.toLowerCase() === message.content.toLowerCase());

        if (duplicates.size >= (config.autoMod.duplicates.threshold || 3) - 1) {
            await punish(message, config.autoMod.duplicates, 'Duplicate messages detected');
            return true;
        }
    } catch (e) {}
    return false;
}

// ==================== CHECK ZALGO ====================
async function checkZalgo(message, config) {
    if (!config.autoMod || !config.autoMod.zalgo || !config.autoMod.zalgo.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const zalgoRegex = /[\u0300-\u036f\u0489]/g;
    if (zalgoRegex.test(message.content)) {
        await punish(message, config.autoMod.zalgo, 'Zalgo text detected');
        return true;
    }
    return false;
}

// ==================== CHECK CHAR REPEAT ====================
async function checkCharRepeat(message, config) {
    if (!config.autoMod || !config.autoMod.charRepeat || !config.autoMod.charRepeat.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const repeatRegex = /(.)\1{9,}/g;
    if (repeatRegex.test(message.content)) {
        await punish(message, config.autoMod.charRepeat, 'Character repeat detected');
        return true;
    }
    return false;
}

// ==================== CHECK PERSONAL INFO ====================
async function checkPersonalInfo(message, config) {
    if (!config.autoMod || !config.autoMod.personalInfo || !config.autoMod.personalInfo.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const content = message.content;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;

    if (emailRegex.test(content) || phoneRegex.test(content) || ipRegex.test(content)) {
        await punish(message, config.autoMod.personalInfo, 'Personal information detected');
        return true;
    }
    return false;
}

// ==================== CHECK MASS MENTION ====================
async function checkMassMention(message, config) {
    if (!config.autoMod || !config.autoMod.massMention || !config.autoMod.massMention.enabled) return false;
    if (isWhitelisted(message, config)) return false;

    const maxMentions = config.autoMod.massMention.max || 10;
    const mentionCount = message.mentions.users.size + message.mentions.roles.size;

    if (mentionCount >= maxMentions) {
        await punish(message, config.autoMod.massMention, 'Mass mention detected');
        return true;
    }
    return false;
}

// ==================== CHECK VOICE SPAM ====================
async function checkVoiceSpam(member, config) {
    try {
        if (!config.autoMod || !config.autoMod.voiceSpam || !config.autoMod.voiceSpam.enabled) return false;

        if (config.whitelist && config.whitelist.users && config.whitelist.users.all) {
            if (config.whitelist.users.all.includes(member.id)) return false;
        }

        const now = Date.now();
        const key = `${member.guild.id}-${member.id}-voice`;
        if (!voiceCache.has(key)) voiceCache.set(key, []);
        const timestamps = voiceCache.get(key);
        timestamps.push(now);

        const window = config.autoMod.voiceSpam.window || 10000;
        const valid = timestamps.filter(t => now - t < window);
        voiceCache.set(key, valid);

        if (valid.length >= (config.autoMod.voiceSpam.maxJoins || 3)) {
            const settings = config.autoMod.voiceSpam;
            const punishment = settings.punishment || 'kick';
            try {
                if (punishment === 'kick' && member.kickable) await member.kick('Voice Spam');
                if (punishment === 'ban' && member.bannable) await member.ban({ reason: 'Voice Spam' });
                if (punishment === 'timeout' && member.moderatable) await member.timeout(settings.timeoutDuration || 60000, 'Voice Spam');
            } catch (e) {}
            voiceCache.set(key, []);
            return true;
        }
        return false;
    } catch (e) {
        console.error(`checkVoiceSpam Error: ${e.message}`);
        return false;
    }
}

// ==================== EXPORTS ====================
module.exports = {
    checkSpam,
    checkInvites,
    checkLinks,
    checkPhishing,
    checkBannedWords,
    checkCaps,
    checkEmoji,
    checkMentions,
    checkDuplicates,
    checkZalgo,
    checkCharRepeat,
    checkPersonalInfo,
    checkMassMention,
    checkVoiceSpam
};
