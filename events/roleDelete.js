const { logRole } = require('../handlers/logger');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'roleDelete',
    once: false,
    async execute(role, client, config) {
        if (!role.guild) return;

        try {
            const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: 32 }).catch(() => null);
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor) {
                    await checkAction(role.guild, entry.executor.id, 'roleDelete', config);
                }
            }
        } catch (e) {
            console.error(`Anti-Nuke RoleDelete Error: ${e.message}`);
        }

        try {
            await logRole(role, 'delete');
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
