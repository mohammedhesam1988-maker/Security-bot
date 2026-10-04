const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'roleDelete',
    once: false,
    async execute(role, client, config) {
        if (!role.guild) return;

        try {
            // ================= ANTI-NUKE =================
            const auditLogs = await role.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleDelete
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
                    await checkAction(role.guild, executor.id, 'roleDelete', config, 15);
                }
            }

            // ================= LOG =================
            if (config.logChannels?.roleDeleted) {
                const logChannel = role.guild.channels.cache.get(config.logChannels.roleDeleted);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#ED4245')
                        .setTitle('🗑️ ڕۆڵ سڕدرایەوە')
                        .addFields(
                            { name: 'ناو', value: role.name || 'نەزانراو', inline: true },
                            { name: 'ID', value: role.id, inline: true },
                            { name: 'سڕەر', value: executor ? `${executor.tag}` : 'نەزانراو', inline: true }
                        )
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }

        } catch (error) {
            console.error('Role Delete Error:', error);
        }
    }
};
