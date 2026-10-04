const { EmbedBuilder } = require('discord.js');

// ================= لیستی ناسراوی فێڵ =================
const PHISHING_DOMAINS = [
    'discord-gift', 'discordnitro', 'free-nitro', 'steamcommunity.ru',
    'gift-discord', 'nitro-gift', 'discordapp.gift', 'nitro-discord',
    'discord-airdrop', 'discordgift', 'discord-nitro', 'free-discord',
    'discordpromo', 'discord-snipe', 'discordsteam', 'discord-event',
    'discord-hype', 'discordnltro', 'discordapp.com.ru', 'discordgifts',
    'discordgift.site', 'discord-nitro.site', 'steamgift', 'steam-gift',
    'csgo-skin', 'csgo-skins', 'free-skins', 'csgofast', 'csgoskins',
    'csgoempire', 'csgobig', 'csgoroll', 'csgodouble', 'csgohunt',
    'bit.ly', 'tinyurl', 'shorturl', 'cutt.ly', 'is.gd'
];

const SUSPICIOUS_KEYWORDS = [
    'free nitro', 'free discord', 'steam gift', 'free skin', 'csgo skin',
    'giveaway free', 'click here', 'claim now', 'limited time', 'act fast',
    'you won', 'you have won', 'congratulations you', 'free robux', 'free vbucks',
    'free minecraft', 'free accounts', 'hack', 'crack', 'cheat', 'exploit'
];

// ================= پشکنینی لینک =================
async function checkPhishing(message, config) {
    try {
        if (!message.guild) return false;
        if (message.author.bot) return false;
        if (!config.antiPhishing?.enabled) return false;

        // ================= لیستی سپی =================
        if (config.whitelist?.users?.all?.includes(message.author.id)) return false;
        if (config.whitelist?.roles?.all && message.member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return false;

        const content = message.content.toLowerCase();

        // ================= پشکنینی ناوەڕۆک =================
        for (const keyword of SUSPICIOUS_KEYWORDS) {
            if (content.includes(keyword)) {
                await punish(message, config, `Phishing: وشەی گوماناوی (${keyword})`);
                return true;
            }
        }

        // ================= پشکنینی لینک =================
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.content.match(urlRegex);

        if (urls) {
            for (const url of urls) {
                const lowerUrl = url.toLowerCase();

                // چێککردنی لیستی سپی
                if (config.antiPhishing.whitelistDomains) {
                    let isWhitelisted = false;
                    for (const domain of config.antiPhishing.whitelistDomains) {
                        if (lowerUrl.includes(domain)) {
                            isWhitelisted = true;
                            break;
                        }
                    }
                    if (isWhitelisted) continue;
                }

                // چێککردنی دۆمەینی گوماناوی
                for (const domain of PHISHING_DOMAINS) {
                    if (lowerUrl.includes(domain)) {
                        await punish(message, config, `Phishing: دۆمەینی گوماناوی (${domain})`);
                        return true;
                    }
                }

                // چێککردنی لینکی نەناسراو (کە پێویستی بە وێبسایتە)
                try {
                    const urlObj = new URL(url);
                    const hostname = urlObj.hostname;

                    // چێککردنی لینکی کورتکراوە
                    if (hostname.includes('bit.ly') || hostname.includes('tinyurl') || hostname.includes('cutt.ly') || hostname.includes('is.gd')) {
                        await punish(message, config, `Phishing: لینکی کورتکراوە (${hostname})`);
                        return true;
                    }

                    // چێککردنی IP Address
                    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
                    if (ipRegex.test(hostname)) {
                        await punish(message, config, `Phishing: IP Address (${hostname})`);
                        return true;
                    }
                } catch (e) {
                    // لینکی نادروست
                }
            }
        }

        return false;
    } catch (error) {
        console.error('checkPhishing Error:', error);
        return false;
    }
}

// ================= پشکنینی هاوپێچ =================
async function checkAttachments(message, config) {
    try {
        if (!message.guild) return false;
        if (message.author.bot) return false;
        if (!config.antiPhishing?.enabled || !config.antiPhishing.checkAttachments) return false;

        if (message.attachments.size === 0) return false;

        for (const [id, attachment] of message.attachments) {
            // ================= پشکنینی جۆری فایل =================
            const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.jar', '.msi', '.ps1', '.sh', '.dll'];
            const fileName = attachment.name.toLowerCase();

            for (const ext of dangerousExtensions) {
                if (fileName.endsWith(ext)) {
                    await punish(message, config, `Phishing: فایلی مەترسیدار (${ext})`);
                    return true;
                }
            }

            // ================= پشکنینی قەبارە =================
            if (attachment.size > 25 * 1024 * 1024) { // ٢٥ MB
                // تەنها ئاگاداری بکەرەوە
                console.log(`⚠️ فایلی گەورە: ${attachment.name} (${(attachment.size / 1024 / 1024).toFixed(2)} MB)`);
            }
        }

        return false;
    } catch (error) {
        console.error('checkAttachments Error:', error);
        return false;
    }
}

// ================= سزادان =================
async function punish(message, config, reason) {
    try {
        const punishment = config.antiPhishing.punishment || 'ban';

        // سڕینەوەی نامەکە
        await message.delete().catch(() => {});

        // جێبەجێکردنی سزا
        if (punishment === 'ban' && message.member.bannable) {
            await message.member.ban({ reason }).catch(() => {});
        } else if (punishment === 'kick' && message.member.kickable) {
            await message.member.kick(reason).catch(() => {});
        } else if (punishment === 'timeout' && message.member.moderatable) {
            await message.member.timeout(60 * 60 * 1000, reason).catch(() => {});
        }

        // ================= لۆگ =================
        const logChannelId = config.logChannels?.security || config.logChannels?.general;
        const logChannel = logChannelId ? message.guild.channels.cache.get(logChannelId) : null;

        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ED4245')
                .setTitle('🚨 Anti-Phishing')
                .setDescription(
                    `**ئەندام:** ${message.author.tag} (<@${message.author.id}>)\n` +
                    `**چانێل:** <#${message.channel.id}>\n` +
                    `**هۆکار:** ${reason}\n` +
                    `**سزا:** ${punishment}`
                )
                .setTimestamp();
            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }

        // ئاگادارکردنی خاوەن
        if (config.autoLockdown?.notifyOwner) {
            const owner = await message.guild.fetchOwner().catch(() => null);
            if (owner) {
                await owner.send(`🚨 Phishing detected in ${message.guild.name}\nUser: ${message.author.tag}\nReason: ${reason}`).catch(() => {});
            }
        }
    } catch (e) {
        console.error('Punish Error:', e.message);
    }
}

// ================= زیادکردنی دۆمەینی نوێ =================
function addPhishingDomain(domain) {
    if (!PHISHING_DOMAINS.includes(domain)) {
        PHISHING_DOMAINS.push(domain);
        return true;
    }
    return false;
}

// ================= سڕینەوەی دۆمەین =================
function removePhishingDomain(domain) {
    const index = PHISHING_DOMAINS.indexOf(domain);
    if (index > -1) {
        PHISHING_DOMAINS.splice(index, 1);
        return true;
    }
    return false;
}

// ================= لیستی دۆمەینەکان =================
function getPhishingDomains() {
    return PHISHING_DOMAINS;
}

module.exports = {
    checkPhishing,
    checkAttachments,
    punish,
    addPhishingDomain,
    removePhishingDomain,
    getPhishingDomains,
    PHISHING_DOMAINS,
    SUSPICIOUS_KEYWORDS
};
