const { logRole } = require('../handlers/logger');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'roleCreate',
    once: false,
    async execute(role, client, config) {
        if (!role.guild) return;

        // ==================== ANTI-NUKE ====================
        try {
            const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: 30 }).catch(() => null);
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor) {
                    await checkAction(role.guild, entry.executor.id, 'roleCreate', config);
                }
            }
        } catch (e) {
            console.error(`Anti-Nuke RoleCreate Error: ${e.message}`);
        }

        // ==================== LOG ====================
        try {
            await logRole(role, 'create');
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
