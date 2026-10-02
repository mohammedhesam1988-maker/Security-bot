const { EmbedBuilder } = require('discord.js');

// ==================== خاڵبەندی بۆ هەر ئەندام ====================
const beastTrackers = new Map();

// ==================== پشکنینی لیستی سپی ====================
function isWhitelisted(member, config) {
    if (!member) return false;
    if (member.id === member.guild.ownerId) return true;
    if (config.whitelist?.users?.all?.includes(member.id)) return true;
    if (config.whitelist?.roles?.all) {
        if (member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return true;
    }
    return false;
}

// ==================== پشکنینی چالاکی ====================
async function checkBeast(guild, userId, action, config) {
    try {
        if (!config.beastMode || !config.beastMode.enabled) return false;
        if (!config.beastMode.actions || !config.beastMode.actions[action]) return false;

        const settings = config.beastMode.actions[action];
        if (!settings.enabled) return false;

        const member = await guild.members.fetch(userId).catch(() => null);
        if (isWhitelisted(member, config)) return false;

        // خاڵبەندی
        const key = `${guild.id}-${userId}-${action}`;
        if (!beastTrackers.has(key)) beastTrackers.set(key, []);
        const tracker = beastTrackers.get(key);
        const now = Date.now();
        tracker.push(now);

        // پاککردنەوەی چالاکییە کۆنەکان (کۆنتر لە ١٠ چرکە)
        const window = 10000;
        const validActions = tracker.filter(t => now - t < window);
        beastTrackers.set(key, validActions);

        // سنووری سزا
        const max = settings.max || 3;

        if (validActions.length >= max) {
            const punishment = settings.punishment || 'ban';
            await punish(guild, userId, punishment, `Beast Mode: ${action}`);
            beastTrackers.set(key, []);
            return true;
        }

        return false;
    } catch (e) {
        console.error(`checkBeast Error: ${e.message}`);
        return false;
    }
}

// ==================== سزادان ====================
async function punish(guild, userId, punishment, reason) {
    try {
        const member = await guild.members.fetch(userId).catch(() => null);
        if (!member) return;

        if (member.id === guild.ownerId) return;
        if (member.roles.highest.position >= guild.members.me.roles.highest.position) return;

        if (punishment === 'kick' && member.kickable) {
            await member.kick(reason).catch(() => {});
        } else if (punishment === 'ban' && member.bannable) {
            await member.ban({ reason }).catch(() => {});
        } else if (punishment === 'timeout' && member.moderatable) {
            await member.timeout(10 * 60 * 1000, reason).catch(() => {});
        } else if (punishment === 'removeRoles') {
            await member.roles.set([]).catch(() => {});
        }

        // تۆمارکردن
        const config = require('../config.js');
        const logChannelId = config.logChannels?.security || config.logChannels?.general;
        const logChannel = logChannelId ? guild.channels.cache.get(logChannelId) : null;

        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🔥 Beast Mode: سزادان')
                .setDescription(
                    `**ئەندام:** <@${userId}>\n` +
                    `**ناو:** ${member.user.tag}\n` +
                    `**هۆکار:** ${reason}\n` +
                    `**سزا:** ${punishment}`
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    } catch (e) {
        console.error(`Punish Error: ${e.message}`);
    }
}

module.exports = {
    checkBeast,
    punish,
    isWhitelisted
};
