const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildBanRemove',
    once: false,
    async execute(ban, client, config) {
        if (!ban.guild) return;

        try {
            // ================= LOG =================
            if (config.logChannels && config.logChannels.memberUnbanned) {
                const logChannel = ban.guild.channels.cache.get(config.logChannels.memberUnbanned);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#57F287')
                        .setTitle('🔓 Member Unbanned')
                        .setDescription(`**User:** ${ban.user.tag} (<@${ban.user.id}>)`)
                        .setThumbnail(ban.user.displayAvatarURL())
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }
        } catch (error) {
            console.error('Guild Ban Remove Error:', error);
        }
    }
};
