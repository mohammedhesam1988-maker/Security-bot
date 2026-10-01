// ==================== SECURITY HANDLER ====================

const { checkAction } = require('./antiNuke');

async function handleSecurityEvent(guild, executorId, action, config) {
    try {
        if (!guild || !executorId || !action) return false;
        if (!config.securityLimits) return false;

        const triggered = await checkAction(guild, executorId, action, config);
        return triggered;
    } catch (e) {
        console.error(`handleSecurityEvent Error: ${e.message}`);
        return false;
    }
}

async function getExecutor(guild, auditType) {
    try {
        const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: auditType }).catch(() => null);
        if (!auditLogs) return null;
        const entry = auditLogs.entries.first();
        if (!entry) return null;
        return entry.executor || null;
    } catch (e) {
        console.error(`getExecutor Error: ${e.message}`);
        return null;
    }
}

async function isWhitelisted(member, config) {
    if (!member) return false;
    if (config.whitelist && config.whitelist.users && config.whitelist.users.all) {
        if (config.whitelist.users.all.includes(member.id)) return true;
    }
    if (config.whitelist && config.whitelist.roles && config.whitelist.roles.all) {
        if (member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return true;
    }
    return false;
}

async function logSecurityEvent(guild, title, description, config) {
    try {
        if (!config.logChannels || !config.logChannels.general) return;
        const channel = guild.channels.cache.get(config.logChannels.general);
        if (!channel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logSecurityEvent Error: ${e.message}`);
    }
}

module.exports = {
    handleSecurityEvent,
    getExecutor,
    isWhitelisted,
    logSecurityEvent
};
