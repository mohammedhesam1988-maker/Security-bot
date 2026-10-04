const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'threadDelete',
    once: false,
    async execute(thread, client, config) {
        if (!thread.guild) return;

        try {
            // ================= GET EXECUTOR =================
            let executor = null;
            try {
                const auditLogs = await thread.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.ThreadDelete
                }).catch(() => null);

                if (auditLogs) {
                    const entry = auditLogs.entries.first();
                    if (entry && entry.executor) {
                        executor = entry.executor;
                    }
                }
            } catch (e) {
                console.error('Thread Delete Audit Error:', e.message);
            }

            // ================= ANTI-NUKE =================
            if (executor) {
                const member = await thread.guild.members.fetch(executor.id).catch(() => null);
                if (member && !member.user.bot) {
                    await checkAction(thread.guild, executor.id, 'threadDelete', config, 5);
                }
            }

            // ================= LOG =================
            if (config.logChannels && config.logChannels.threadDeleted) {
                try {
                    const logChannel = thread.guild.channels.cache.get(config.logChannels.threadDeleted);
                    if (logChannel) {
                        const embed = new EmbedBuilder()
                            .setColor('#ED4245')
                            .setTitle('🗑️ Thread Deleted')
                            .addFields(
                                { name: 'Name', value: thread.name || 'Unknown', inline: true },
                                { name: 'ID', value: thread.id, inline: true },
                                { name: 'Parent', value: thread.parent ? `${thread.parent.name}` : 'Unknown', inline: true },
                                { name: 'Deleted By', value: executor ? `${executor.tag}` : 'Unknown', inline: true }
                            )
                            .setTimestamp();
                        await logChannel.send({ embeds: [embed] }).catch(() => {});
                    }
                } catch (e) {
                    console.error(`Thread Delete Log Error: ${e.message}`);
                }
            }

        } catch (error) {
            console.error('Thread Delete Error:', error);
        }
    }
};
