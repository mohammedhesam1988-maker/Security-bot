const { logChannel } = require('../handlers/logger');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'channelDelete',
    once: false,
    async execute(channel, client, config) {
        if (!channel.guild) return;

        // ==================== ANTI-NUKE ====================
        try {
            const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: 12 }).catch(() => null);
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor) {
                    await checkAction(channel.guild, entry.executor.id, 'channelDelete', config);
                }
            }
        } catch (e) {
            console.error(`Anti-Nuke ChannelDelete Error: ${e.message}`);
        }

        // ==================== LOG ====================
        try {
            await logChannel(channel, 'delete');
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
