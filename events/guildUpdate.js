const { sendLog } = require('../handlers/logger');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'guildUpdate',
    once: false,
    async execute(oldGuild, newGuild, client, config) {
        if (oldGuild.name !== newGuild.name) {
            try {
                const auditLogs = await newGuild.fetchAuditLogs({ limit: 1, type: 1 }).catch(() => null);
                if (auditLogs) {
                    const entry = auditLogs.entries.first();
                    if (entry && entry.executor) {
                        await checkAction(newGuild, entry.executor.id, 'serverRename', config);
                    }
                }
            } catch (e) {
                console.error(`Anti-Nuke ServerRename Error: ${e.message}`);
            }
        }

        if (oldGuild.iconURL() !== newGuild.iconURL()) {
            try {
                const auditLogs = await newGuild.fetchAuditLogs({ limit: 1, type: 1 }).catch(() => null);
                if (auditLogs) {
                    const entry = auditLogs.entries.first();
                    if (entry && entry.executor) {
                        await checkAction(newGuild, entry.executor.id, 'serverIconChange', config);
                    }
                }
            } catch (e) {
                console.error(`Anti-Nuke ServerIcon Error: ${e.message}`);
            }
        }

        try {
            await sendLog(newGuild, '🌐 Server Updated', `**Server:** ${newGuild.name}`, '#FBBF24');
        } catch (e) {
            console.error(`Server Update Log Error: ${e.message}`);
        }
    }
};
