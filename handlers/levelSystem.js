// ==================== LEVEL SYSTEM HANDLER ====================

const userCooldowns = new Map();

// ==================== GET USER DATA ====================
async function getUserData(userId, guildId) {
    try {
        const fs = require('fs');
        const path = require('path');
        const dataPath = path.join(__dirname, '..', 'data', 'levels.json');

        if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
            fs.mkdirSync(path.join(__dirname, '..', 'data'));
        }
        if (!fs.existsSync(dataPath)) {
            fs.writeFileSync(dataPath, '{}');
        }

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const key = `${guildId}-${userId}`;

        if (!data[key]) {
            data[key] = { xp: 0, level: 0, messages: 0 };
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        }

        return data[key];
    } catch (e) {
        console.error(`getUserData Error: ${e.message}`);
        return { xp: 0, level: 0, messages: 0 };
    }
}

// ==================== SAVE USER DATA ====================
async function saveUserData(userId, guildId, userData) {
    try {
        const fs = require('fs');
        const path = require('path');
        const dataPath = path.join(__dirname, '..', 'data', 'levels.json');

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const key = `${guildId}-${userId}`;
        data[key] = userData;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`saveUserData Error: ${e.message}`);
    }
}

// ==================== GET XP FOR LEVEL ====================
function getXPForLevel(level) {
    // فۆرمۆلا: 5 * (level^2) + 50 * level + 100
    return 5 * (level * level) + 50 * level + 100;
}

// ==================== ADD XP ====================
async function addXP(member, message, config) {
    try {
        if (!config.levels || !config.levels.enabled) return;
        if (member.user.bot) return;

        // پشکنینی کەناڵە قەدەغەکراوەکان
        if (config.levels.blacklistedChannels && config.levels.blacklistedChannels.includes(message.channel.id)) return;

        // پشکنینی ڕۆڵە قەدەغەکراوەکان
        if (config.levels.blacklistedRoles && config.levels.blacklistedRoles.length > 0) {
            if (member.roles.cache.some(r => config.levels.blacklistedRoles.includes(r.id))) return;
        }

        // پشکنینی بەکارهێنەرە پشتگوێخراوەکان
        if (config.levels.ignoredUsers && config.levels.ignoredUsers.includes(member.id)) return;

        // پشکنینی کۆداون
        const key = `${member.guild.id}-${member.id}`;
        const now = Date.now();
        const cooldown = config.levels.cooldown || 60000;

        if (userCooldowns.has(key)) {
            if (now - userCooldowns.get(key) < cooldown) return;
        }
        userCooldowns.set(key, now);

        // وەرگرتنی داتای بەکارهێنەر
        const userData = await getUserData(member.id, member.guild.id);

        // دیاریکردنی XP
        const xpMin = config.levels.xpPerMessage?.min || 15;
        const xpMax = config.levels.xpPerMessage?.max || 25;
        let xpToAdd = Math.floor(Math.random() * (xpMax - xpMin + 1)) + xpMin;

        // پشکنینی XP Multiplier
        if (config.levels.xpMultiplier) {
            for (const [roleId, multiplier] of Object.entries(config.levels.xpMultiplier)) {
                if (member.roles.cache.has(roleId)) {
                    xpToAdd *= multiplier;
                    break;
                }
            }
        }

        // زیادکردنی XP
        userData.xp += xpToAdd;
        userData.messages += 1;

        // پشکنینی ئاست بەرزبوونەوە
        const requiredXP = getXPForLevel(userData.level + 1);

        if (userData.xp >= requiredXP) {
            userData.level += 1;
            userData.xp -= requiredXP;

            await handleLevelUp(member, userData.level, config);
        }

        // پاشەکەوتکردنی داتا
        await saveUserData(member.id, member.guild.id, userData);

    } catch (e) {
        console.error(`addXP Error: ${e.message}`);
    }
}

// ==================== HANDLE LEVEL UP ====================
async function handleLevelUp(member, level, config) {
    try {
        const { EmbedBuilder } = require('discord.js');

        // ناردنی نامەی ئاست بەرزبوونەوە
        if (config.levels.levelUpMessage) {
            let message = config.levels.levelUpMessage
                .replace(/%member_mention%/g, `<@${member.id}>`)
                .replace(/%member_name%/g, member.user.username)
                .replace(/%member_tag%/g, member.user.tag)
                .replace(/%level%/g, level)
                .replace(/%server_name%/g, member.guild.name);

            // دیاریکردنی کەناڵ
            const channelId = config.levels.levelUpChannel;
            const channel = channelId ? member.guild.channels.cache.get(channelId) : null;

            if (config.levels.levelUpEmbed) {
                const embed = new EmbedBuilder()
                    .setColor(config.levels.levelUpColor || '#57F287')
                    .setTitle('🎉 Level Up!')
                    .setDescription(message)
                    .setTimestamp();

                if (channel) {
                    await channel.send({ embeds: [embed] }).catch(() => {});
                } else {
                    await member.send({ embeds: [embed] }).catch(() => {});
                }
            } else {
                if (channel) {
                    await channel.send({ content: message }).catch(() => {});
                } else {
                    await member.send({ content: message }).catch(() => {});
                }
            }
        }

        // دانانی ڕۆڵ بۆ ئاست
        if (config.levels.roles && config.levels.roles[level]) {
            const roleId = config.levels.roles[level];
            const role = member.guild.roles.cache.get(roleId);
            if (role) {
                await member.roles.add(role).catch(() => {});
            }
        }

        // ناردنی DM
        if (config.levels.announceInDM) {
            const dmMessage = `🎉 Congratulations! You have reached **Level ${level}** in **${member.guild.name}**!`;
            await member.send({ content: dmMessage }).catch(() => {});
        }

    } catch (e) {
        console.error(`handleLevelUp Error: ${e.message}`);
    }
}

// ==================== GET LEADERBOARD ====================
async function getLeaderboard(guildId, limit = 10) {
    try {
        const fs = require('fs');
        const path = require('path');
        const dataPath = path.join(__dirname, '..', 'data', 'levels.json');

        if (!fs.existsSync(dataPath)) return [];

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const users = [];

        for (const [key, userData] of Object.entries(data)) {
            if (key.startsWith(guildId + '-')) {
                const userId = key.split('-')[1];
                users.push({ userId, ...userData });
            }
        }

        users.sort((a, b) => b.level - a.level || b.xp - a.xp);
        return users.slice(0, limit);
    } catch (e) {
        console.error(`getLeaderboard Error: ${e.message}`);
        return [];
    }
}

// ==================== EXPORTS ====================
module.exports = {
    addXP,
    getUserData,
    saveUserData,
    getXPForLevel,
    handleLevelUp,
    getLeaderboard
};
