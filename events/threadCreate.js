const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'threadCreate',
    once: false,
    async execute(thread, client, config) {
        if (!thread.guild) return;

        try {
            // ================= GET EXECUTOR =================
            let executor = null;
            try {
                const auditLogs = await thread.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.ThreadCreate
                }).catch(() => null);

                if (auditLogs) {
                    const entry = auditLogs.entries.first();
                    if (entry && entry.executor) {
                        executor = entry.executor;
                    }
                }
            } catch (e) {
                console.error('Thread Create Audit Error:', e.message);
            }

            // ================= ANTI-NUKE =================
            if (executor) {
                const member = await thread.guild.members.fetch(executor.id).catch(() => null);
                if (member && !member.user.bot) {
                    await checkAction(thread.guild, executor.id, 'threadCreate', config, 5);
                }
            }

            // ================= LOG =================
            if (config.logChannels && config.logChannels.threadCreated) {
                try {
                    const logChannel = thread.guild.channels.cache.get(config.logChannels.threadCreated);
                    if (logChannel) {
                        const embed = new EmbedBuilder()
                            .setColor('#57F287')
                            .setTitle('🧵 Thread Created')
                            .addFields(
                                { name: 'Name', value: thread.name || 'Unknown', inline: true },
                                { name: 'ID', value: thread.id, inline: true },
                                { name: 'Parent', value: thread.parent ? `${thread.parent.name}` : 'Unknown', inline: true },
                                { name: 'Creator', value: executor ? `${executor.tag}` : 'Unknown', inline: true }
                            )
                            .setTimestamp();
                        await logChannel.send({ embeds: [embed] }).catch(() => {});
                    }
                } catch (e) {
                    console.error(`Thread Create Log Error: ${e.message}`);
                }
            }

        } catch (error) {
            console.error('Thread Create Error:', error);
        }
    }
};
