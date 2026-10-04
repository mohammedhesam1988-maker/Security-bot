const { EmbedBuilder } = require('discord.js');

// ================= لیستی ناسراوی ساختەکاری =================
const SCAM_LINKS = [
    'free-nitro', 'discord-nitro', 'nitro-free', 'discordgift',
    'discord-gift', 'steamgift', 'steam-gift', 'free-steam',
    'free-robux', 'robux-free', 'free-vbucks', 'vbucks-free',
    'free-minecraft', 'minecraft-free', 'free-fortnite', 'fortnite-free',
    'free-gift', 'gift-free', 'claim-gift', 'claim-free',
    'free-money', 'money-free', 'free-crypto', 'crypto-free',
    'free-bitcoin', 'bitcoin-free', 'free-ethereum', 'ethereum-free'
];

const SCAM_KEYWORDS = [
    'free nitro', 'free discord nitro', 'free steam', 'free robux',
    'free vbucks', 'free minecraft', 'free fortnite', 'free gift',
    'claim your free', 'claim now', 'limited time offer', 'act fast',
    'you won', 'you have won', 'congratulations you won', 'you are the winner',
    'click here to claim', 'click to claim', 'get your free',
    'free giveaway', 'giveaway free', 'win free', 'win a free',
    'free skin', 'free skins', 'free account', 'free accounts',
    'hack', 'crack', 'cheat', 'exploit', 'free hack',
    'free crack', 'free cheat', 'free exploit'
];

const SCAM_PATTERNS = [
    /free\s+(nitro|robux|vbucks|minecraft|fortnite|steam|gift|money|crypto|bitcoin|ethereum)/gi,
    /(nitro|robux|vbucks|minecraft|fortnite|steam|gift|money|crypto|bitcoin|ethereum)\s+free/gi,
    /claim\s+(your\s+)?(free|gift|prize|reward)/gi,
    /you\s+(have\s+)?won/gi,
    /congratulations?\s+you/gi,
    /click\s+(here\s+)?to\s+(claim|get|win)/gi
];

// ================= پشکنینی ساختەکاری =================
async function checkScam(message, config) {
    try {
        if (!message.guild) return false;
        if (message.author.bot) return false;
        if (!config.antiScam?.enabled) return false;

        // ================= لیستی سپی =================
        if (config.whitelist?.users?.all?.includes(message.author.id)) return false;
        if (config.whitelist?.roles?.all && message.member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return false;

        const content = message.content.toLowerCase();

        // ================= پشکنینی وشە =================
        for (const keyword of SCAM_KEYWORDS) {
            if (content.includes(keyword.toLowerCase())) {
                await punish(message, config, `Scam: وشەی گوماناوی (${keyword})`);
                return true;
            }
        }

        // ================= پشکنینی پاتێرن =================
        for (const pattern of SCAM_PATTERNS) {
            if (pattern.test(content)) {
                await punish(message, config, `Scam: پاتێرنی گوماناوی`);
                return true;
            }
        }

        // ================= پشکنینی لینک =================
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.content.match(urlRegex);

        if (urls) {
            for (const url of urls) {
                const lowerUrl = url.toLowerCase();
                for (const scamLink of SCAM_LINKS) {
                    if (lowerUrl.includes(scamLink)) {
                        await punish(message, config, `Scam: لینکی ساختە (${scamLink})`);
                        return true;
                    }
                }
            }
        }

        return false;
    } catch (error) {
        console.error('checkScam Error:', error);
        return false;
    }
}

// ================= پشکنینی ساختەکاری لە DM =================
async function checkScamDM(message, config) {
    try {
        if (message.guild) return false;
        if (message.author.bot) return false;
        if (!config.antiScam?.enabled || !config.antiScam.checkDMs) return false;

        const content = message.content.toLowerCase();

        // ================= پشکنینی وشە =================
        for (const keyword of SCAM_KEYWORDS) {
            if (content.includes(keyword.toLowerCase())) {
                await punishDM(message, config, `Scam DM: وشەی گوماناوی (${keyword})`);
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('checkScamDM Error:', error);
        return false;
    }
}

// ================= سزادان =================
async function punish(message, config, reason) {
    try {
        const punishment = config.antiScam?.punishment || 'ban';

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
                .setColor('#8B0000')
                .setTitle('🚨 Anti-Scam')
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
                await owner.send(`🚨 Scam detected in ${message.guild.name}\nUser: ${message.author.tag}\nReason: ${reason}`).catch(() => {});
            }
        }
    } catch (e) {
        console.error('Punish Error:', e.message);
    }
}

// ================= سزادان لە DM =================
async function punishDM(message, config, reason) {
    try {
        // لە DM دا ناتوانین سزا بدەین، تەنها بلۆک بکەین
        await message.author.send(`⚠️ ئاگادارکردنەوە: نامەکەت وەک ساختەکاری ناسرا.`).catch(() => {});
        console.log(`⚠️ Scam DM detected from ${message.author.tag}: ${reason}`);
    } catch (e) {
        console.error('Punish DM Error:', e.message);
    }
}

// ================= زیادکردنی لینکی ساختە =================
function addScamLink(link) {
    if (!SCAM_LINKS.includes(link)) {
        SCAM_LINKS.push(link);
        return true;
    }
    return false;
}

// ================= سڕینەوەی لینکی ساختە =================
function removeScamLink(link) {
    const index = SCAM_LINKS.indexOf(link);
    if (index > -1) {
        SCAM_LINKS.splice(index, 1);
        return true;
    }
    return false;
}

// ================= لیستی لینکەکان =================
function getScamLinks() {
    return SCAM_LINKS;
}

module.exports = {
    checkScam,
    checkScamDM,
    punish,
    punishDM,
    addScamLink,
    removeScamLink,
    getScamLinks,
    SCAM_LINKS,
    SCAM_KEYWORDS,
    SCAM_PATTERNS
};
