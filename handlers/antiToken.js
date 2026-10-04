const { EmbedBuilder } = require('discord.js');

// ================= پاتێرنەکانی تۆکن =================
const TOKEN_PATTERNS = [
    /[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g, // Discord Token
    /mfa\.[\w-]{84}/g, // MFA Token
    /[A-Za-z\d]{24}\.[\w-]{6}\.[\w-]{27}/g, // Bot Token
    /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g // Generic Token
];

// ================= پاتێرنەکانی ناسنامەی نهێنی =================
const SECRET_PATTERNS = [
    /(?:api[_-]?key|apikey)[\s:=]+['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
    /(?:secret|password|passwd|pwd)[\s:=]+['"]?([^\s'"]{8,})['"]?/gi,
    /(?:token|auth)[\s:=]+['"]?([a-zA-Z0-9_\-\.]{20,})['"]?/gi,
    /(?:private[_-]?key)[\s:=]+['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi
];

// ================= پشکنینی تۆکن =================
async function checkToken(message, config) {
    try {
        if (!message.guild) return false;
        if (message.author.bot) return false;
        if (!config.antiToken?.enabled) return false;

        // ================= لیستی سپی =================
        if (config.whitelist?.users?.all?.includes(message.author.id)) return false;
        if (config.whitelist?.roles?.all && message.member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return false;

        const content = message.content;

        // ================= پشکنینی تۆکن =================
        for (const pattern of TOKEN_PATTERNS) {
            if (pattern.test(content)) {
                await punish(message, config, 'Token Detected');
                return true;
            }
        }

        // ================= پشکنینی ناسنامەی نهێنی =================
        for (const pattern of SECRET_PATTERNS) {
            if (pattern.test(content)) {
                await punish(message, config, 'Secret/API Key Detected');
                return true;
            }
        }

        // ================= پشکنینی Base64 =================
        const base64Regex = /(?:[A-Za-z0-9+/]{40,}={0,2})/g;
        const base64Matches = content.match(base64Regex);
        if (base64Matches) {
            for (const match of base64Matches) {
                try {
                    const decoded = Buffer.from(match, 'base64').toString('utf-8');
                    for (const pattern of TOKEN_PATTERNS) {
                        if (pattern.test(decoded)) {
                            await punish(message, config, 'Encoded Token Detected');
                            return true;
                        }
                    }
                } catch (e) {
                    // نەتوانرا شی بکرێتەوە
                }
            }
        }

        return false;
    } catch (error) {
        console.error('checkToken Error:', error);
        return false;
    }
}

// ================= پشکنینی Self-Bot =================
async function checkSelfBot(message, config) {
    try {
        if (!message.guild) return false;
        if (message.author.bot) return false;
        if (!config.autoMod?.selfBot?.enabled) return false;

        // ================= نیشانەکانی Self-Bot =================
        const content = message.content;

        // چێککردنی کۆماندی ناسراوی Self-Bot
        const selfBotCommands = ['!selfbot', '.selfbot', 'selfbot', 'nuke', 'raid', 'spam'];
        for (const cmd of selfBotCommands) {
            if (content.toLowerCase().includes(cmd)) {
                // تەنها ئاگاداری بکەرەوە، سزا نەدە
                console.log(`⚠️ Self-Bot detected: ${message.author.tag} - ${cmd}`);
            }
        }

        // چێککردنی تایپکردنی خێرا (زۆر نامە لە کاتی کەمدا)
        // ئەمە لە antiSpam.js دا چێک کراوە

        return false;
    } catch (error) {
        console.error('checkSelfBot Error:', error);
        return false;
    }
}

// ================= سزادان =================
async function punish(message, config, reason) {
    try {
        const punishment = config.antiToken?.punishment || 'ban';

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
                .setTitle('🚨 Anti-Token')
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
                await owner.send(`🚨 Token/Secret detected in ${message.guild.name}\nUser: ${message.author.tag}\nReason: ${reason}`).catch(() => {});
            }
        }
    } catch (e) {
        console.error('Punish Error:', e.message);
    }
}

// ================= زیادکردنی پاتێرنی نوێ =================
function addTokenPattern(pattern) {
    if (!TOKEN_PATTERNS.includes(pattern)) {
        TOKEN_PATTERNS.push(pattern);
        return true;
    }
    return false;
}

// ================= لیستی پاتێرنەکان =================
function getTokenPatterns() {
    return TOKEN_PATTERNS;
}

module.exports = {
    checkToken,
    checkSelfBot,
    punish,
    addTokenPattern,
    getTokenPatterns,
    TOKEN_PATTERNS,
    SECRET_PATTERNS
};
