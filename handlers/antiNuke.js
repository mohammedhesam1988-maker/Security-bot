// ==================== ANTI-NUKE HANDLER ====================

const actionTrackers = new Map();

function getTracker(guildId, userId, action) {
    const key = `${guildId}-${userId}-${action}`;
    if (!actionTrackers.has(key)) actionTrackers.set(key, []);
    return actionTrackers.get(key);
}

function isWhitelisted(member, config) {
    if (!member) return false;
    if (config.whitelist && config.whitelist.users && config.whitelist.users.all) {
        if (config.whitelist.users.all.includes(member.id)) return true;
    }
    if (config.whitelist && config.whitelist.roles && config.whitelist.roles.all) {
        if (member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return true;
    }
    return false;
}

async function punish(guild, userId, punishment, reason) {
    try {
        const member = await guild.members.fetch(userId).catch(() => null);
        if (!member) return;

        if (punishment === 'kick' && member.kickable) {
            await member.kick(reason).catch(() => {});
        } else if (punishment === 'ban' && member.bannable) {
            await member.ban({ reason }).catch(() => {});
        } else if (punishment === 'timeout' && member.moderatable) {
            await member.timeout(60000, reason).catch(() => {});
        } else if (punishment === 'detect') {
            const config = require('../config.js');
            const logChannelId = config.logChannels && config.logChannels.general;
            const logChannel = logChannelId ? guild.channels.cache.get(logChannelId) : null;
            if (logChannel) {
                const { EmbedBuilder } = require('discord.js');
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('⚠️ Suspicious Activity Detected')
                    .setDescription(`**User:** <@${userId}>\n**Reason:** ${reason}`)
                    .setTimestamp();
                await logChannel.send({ embeds: [embed] }).catch(() => {});
            }
        }
    } catch (e) {
        console.error(`Punish Error: ${e.message}`);
    }
}

async function checkAction(guild, userId, action, config) {
    try {
        if (!config.securityLimits || !config.securityLimits[action]) return false;
        const settings = config.securityLimits[action];
        if (!settings.enabled) return false;

        const member = await guild.members.fetch(userId).catch(() => null);
        if (isWhitelisted(member, config)) return false;

        const tracker = getTracker(guild.id, userId, action);
        const now = Date.now();
        tracker.push(now);

        const window = 60000;
        const validActions = tracker.filter(t => now - t < window);
        actionTrackers.set(`${guild.id}-${userId}-${action}`, validActions);

        const max = settings.max || 5;
        if (validActions.length >= max) {
            const punishment = settings.punishment || 'kick';
            await punish(guild, userId, punishment, `Anti-Nuke: ${action}`);
            actionTrackers.set(`${guild.id}-${userId}-${action}`, []);
            return true;
        }
        return false;
    } catch (e) {
        console.error(`checkAction Error: ${e.message}`);
        return false;
    }
}

module.exports = {
    checkAction,
    isWhitelisted,
    punish
};
