const { logBan } = require('../handlers/logger');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'guildBanAdd',
    once: false,
    async execute(ban, client, config) {
        if (!ban.guild) return;

        try {
            const auditLogs = await ban.guild.fetchAuditLogs({ limit: 1, type: 22 }).catch(() => null);
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor) {
                    await checkAction(ban.guild, entry.executor.id, 'ban', config);
                }
            }
        } catch (e) {
            console.error(`Anti-Nuke Ban Error: ${e.message}`);
        }

        try {
            await logBan(ban);
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
