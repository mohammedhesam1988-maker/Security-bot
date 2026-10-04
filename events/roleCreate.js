const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'roleCreate',
    once: false,
    async execute(role, client, config) {
        if (!role.guild) return;

        try {
            // ================= ANTI-NUKE =================
            const auditLogs = await role.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleCreate
            }).catch(() => null);

            let executor = null;
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor) {
                    executor = entry.executor;
                }
            }

            if (executor) {
                const member = await role.guild.members.fetch(executor.id).catch(() => null);
                if (member && !member.user.bot) {
                    await checkAction(role.guild, executor.id, 'roleCreate', config, 10);
                }
            }

            // ================= LOG =================
            if (config.logChannels?.roleCreated) {
                const logChannel = role.guild.channels.cache.get(config.logChannels.roleCreated);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#57F287')
                        .setTitle('🎭 ڕۆڵی نوێ دروستکرا')
                        .addFields(
                            { name: 'ناو', value: role.name, inline: true },
                            { name: 'ڕەنگ', value: `${role.hexColor}`, inline: true },
                            { name: 'ID', value: role.id, inline: true },
                            { name: 'دروستکەر', value: executor ? `${executor.tag}` : 'نەزانراو', inline: true }
                        )
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }

        } catch (error) {
            console.error('Role Create Error:', error);
        }
    }
};
