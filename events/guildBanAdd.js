const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildBanAdd',
    once: false,
    async execute(ban, client, config) {
        if (!ban.guild) return;

        try {
            // ================= LOG =================
            if (config.logChannels && config.logChannels.memberBanned) {
                const logChannel = ban.guild.channels.cache.get(config.logChannels.memberBanned);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#ED4245')
                        .setTitle('🔨 Member Banned')
                        .setDescription(`**User:** ${ban.user.tag} (<@${ban.user.id}>)\n**Reason:** ${ban.reason || 'No reason provided'}`)
                        .setThumbnail(ban.user.displayAvatarURL())
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }
        } catch (error) {
            console.error('Guild Ban Add Error:', error);
        }
    }
};
