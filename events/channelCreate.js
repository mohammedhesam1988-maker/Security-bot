const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'channelCreate',
    once: false,
    async execute(channel, client, config) {
        if (!channel.guild) return;

        try {
            // ================= ANTI-NUKE =================
            const auditLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelCreate
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
                    await checkAction(channel.guild, executor.id, 'channelCreate', config, 5);
                }
            }

            // ================= LOG =================
            if (config.logChannels?.channelCreated) {
                const logChannel = channel.guild.channels.cache.get(config.logChannels.channelCreated);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#57F287')
                        .setTitle('📁 چانێلی نوێ دروستکرا')
                        .addFields(
                            { name: 'ناو', value: channel.name, inline: true },
                            { name: 'جۆر', value: `${channel.type}`, inline: true },
                            { name: 'ID', value: channel.id, inline: true },
                            { name: 'دروستکەر', value: executor ? `${executor.tag}` : 'نەزانراو', inline: true }
                        )
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }

        } catch (error) {
            console.error('Channel Create Error:', error);
        }
    }
};
