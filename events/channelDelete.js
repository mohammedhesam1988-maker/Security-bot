const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'channelDelete',
    once: false,
    async execute(channel, client, config) {
        if (!channel.guild) return;

        try {
            // ================= ANTI-NUKE =================
            const auditLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelDelete
            }).catch(() => null);

            let executor = null;
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor) {
                    executor = entry.executor;
                }
            }

            if (executor) {
                const member = await channel.guild.members.fetch(executor.id).catch(() => null);
                if (member && !member.user.bot) {
                    await checkAction(channel.guild, executor.id, 'channelDelete', config, 10);
                }
            }

            // ================= LOG =================
            if (config.logChannels?.channelDeleted) {
                const logChannel = channel.guild.channels.cache.get(config.logChannels.channelDeleted);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#ED4245')
                        .setTitle('🗑️ چانێل سڕدرایەوە')
                        .addFields(
                            { name: 'ناو', value: channel.name || 'نەزانراو', inline: true },
                            { name: 'ID', value: channel.id, inline: true },
                            { name: 'سڕەر', value: executor ? `${executor.tag}` : 'نەزانراو', inline: true }
                        )
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }

        } catch (error) {
            console.error('Channel Delete Error:', error);
        }
    }
};
