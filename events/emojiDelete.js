const { sendLog } = require('../handlers/logger');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'emojiDelete',
    once: false,
    async execute(emoji, client, config) {
        if (!emoji.guild) return;

        try {
            const auditLogs = await emoji.guild.fetchAuditLogs({ limit: 1, type: 62 }).catch(() => null);
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor) {
                    await checkAction(emoji.guild, entry.executor.id, 'emojiDelete', config);
                }
            }
        } catch (e) {
            console.error(`Anti-Nuke EmojiDelete Error: ${e.message}`);
        }

        try {
            await sendLog(emoji.guild, '🗑️ Emoji Deleted', `**Name:** ${emoji.name}\n**ID:** ${emoji.id}`, '#EF4444');
        } catch (e) {
            console.error(`Emoji Delete Log Error: ${e.message}`);
        }
    }
};
