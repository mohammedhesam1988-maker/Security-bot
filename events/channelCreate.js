const { logChannel } = require('../handlers/logger');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'channelCreate',
    once: false,
    async execute(channel, client, config) {
        if (!channel.guild) return;

        // ==================== ANTI-NUKE ====================
        try {
            const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: 10 }).catch(() => null);
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor) {
                    await checkAction(channel.guild, entry.executor.id, 'channelCreate', config);
                }
            }
        } catch (e) {
            console.error(`Anti-Nuke ChannelCreate Error: ${e.message}`);
        }

        // ==================== LOG ====================
        try {
            await logChannel(channel, 'create');
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
