const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'emojiCreate',
    once: false,
    async execute(emoji, client, config) {
        if (!emoji.guild) return;

        try {
            // ================= ANTI-NUKE =================
            const auditLogs = await emoji.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.EmojiCreate
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
                    await checkAction(emoji.guild, executor.id, 'emojiCreate', config, 5);
                }
            }

            // ================= LOG =================
            if (config.logChannels?.emojiCreated) {
                const logChannel = emoji.guild.channels.cache.get(config.logChannels.emojiCreated);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#57F287')
                        .setTitle('😀 ئیمۆجی نوێ دروستکرا')
                        .addFields(
                            { name: 'ناو', value: emoji.name, inline: true },
                            { name: 'ID', value: emoji.id, inline: true },
                            { name: 'دروستکەر', value: executor ? `${executor.tag}` : 'نەزانراو', inline: true }
                        )
                        .setThumbnail(emoji.url)
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }

        } catch (error) {
            console.error('Emoji Create Error:', error);
        }
    }
};
