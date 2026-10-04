const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'emojiDelete',
    once: false,
    async execute(emoji, client, config) {
        if (!emoji.guild) return;

        try {
            // ================= ANTI-NUKE =================
            const auditLogs = await emoji.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.EmojiDelete
            }).catch(() => null);

            let executor = null;
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor) {
                    executor = entry.executor;
                }
            }

            if (executor) {
                const member = await emoji.guild.members.fetch(executor.id).catch(() => null);
                if (member && !member.user.bot) {
                    await checkAction(emoji.guild, executor.id, 'emojiDelete', config, 10);
                }
            }

            // ================= LOG =================
            if (config.logChannels?.emojiDeleted) {
                const logChannel = emoji.guild.channels.cache.get(config.logChannels.emojiDeleted);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#ED4245')
                        .setTitle('🗑️ ئیمۆجی سڕدرایەوە')
                        .addFields(
                            { name: 'ناو', value: emoji.name || 'نەزانراو', inline: true },
                            { name: 'ID', value: emoji.id, inline: true },
                            { name: 'سڕەر', value: executor ? `${executor.tag}` : 'نەزانراو', inline: true }
                        )
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }

        } catch (error) {
            console.error('Emoji Delete Error:', error);
        }
    }
};
