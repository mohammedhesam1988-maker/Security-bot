module.exports = {
    name: 'inviteCreate',
    once: false,
    async execute(invite, client, config) {
        if (!invite.guild) return;
        const { guild } = invite;

        // ==================== LOG ====================
        if (config.logChannels && config.logChannels.general) {
            try {
                const logChannel = guild.channels.cache.get(config.logChannels.general);
                if (logChannel) {
                    const { EmbedBuilder } = require('discord.js');
                    const embed = new EmbedBuilder()
                        .setColor('#22C55E')
                        .setTitle('🔗 Invite Created')
                        .setDescription(`**Code:** ${invite.code}\n**Channel:** <#${invite.channelId}>\n**Inviter:** ${invite.inviter ? invite.inviter.tag : 'Unknown'}\n**Max Uses:** ${invite.maxUses || '∞'}\n**Expires:** ${invite.expiresAt ? `<t:${Math.floor(invite.expiresAt.getTime() / 1000)}:R>` : 'Never'}`)
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            } catch (e) {
                console.error(`Invite Create Log Error: ${e.message}`);
            }
        }
    }
};
