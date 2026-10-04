const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'threadUpdate',
    once: false,
    async execute(oldThread, newThread, client, config) {
        if (!newThread.guild) return;

        try {
            // ================= GET EXECUTOR =================
            let executor = null;
            try {
                const auditLogs = await newThread.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.ThreadUpdate
                }).catch(() => null);

                if (auditLogs) {
                    const entry = auditLogs.entries.first();
                    if (entry && entry.executor) {
                        executor = entry.executor;
                    }
                }
            } catch (e) {
                console.error('Thread Update Audit Error:', e.message);
            }

            // ================= ANTI-NUKE =================
            if (executor && oldThread.name !== newThread.name) {
                const member = await newThread.guild.members.fetch(executor.id).catch(() => null);
                if (member && !member.user.bot) {
                    await checkAction(newThread.guild, executor.id, 'threadRename', config);
                }
            }

            // ================= LOG =================
            if (config.logChannels && config.logChannels.threadUpdated) {
                try {
                    const logChannel = newThread.guild.channels.cache.get(config.logChannels.threadUpdated);
                    if (logChannel) {
                        let changes = [];

                        if (oldThread.name !== newThread.name) {
                            changes.push(`📝 **Name:** \`${oldThread.name}\` → \`${newThread.name}\``);
                        }
                        if (oldThread.archived !== newThread.archived) {
                            changes.push(`📦 **Archived:** \`${oldThread.archived}\` → \`${newThread.archived}\``);
                        }
                        if (oldThread.locked !== newThread.locked) {
                            changes.push(`🔒 **Locked:** \`${oldThread.locked}\` → \`${newThread.locked}\``);
                        }
                        if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
                            changes.push(`⏱️ **Slowmode:** \`${oldThread.rateLimitPerUser}\` → \`${newThread.rateLimitPerUser}\``);
                        }

                        if (changes.length > 0) {
                            let description = `**Thread:** <#${newThread.id}>\n**ID:** \`${newThread.id}\`\n`;
                            if (executor) {
                                description += `**Modified By:** ${executor.tag} (<@${executor.id}>)\n`;
                            }
                            description += `\n─────────────────\n\n`;
                            description += changes.join('\n');

                            const embed = new EmbedBuilder()
                                .setColor('#FEE75C')
                                .setTitle('✏️ Thread Updated')
                                .setDescription(description)
                                .setTimestamp();

                            await logChannel.send({ embeds: [embed] }).catch(() => {});
                        }
                    }
                } catch (e) {
                    console.error(`Thread Update Log Error: ${e.message}`);
                }
            }

        } catch (error) {
            console.error('Thread Update Error:', error);
        }
    }
};
