const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_invite')
        .setDescription('دروستکردنی لینکی بانگهێشتنامە بۆ سێرڤەر')
        .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite),
    async execute(interaction, client, config) {
        try {
            const invite = await interaction.channel.createInvite({
                maxAge: 0,
                maxUses: 0,
                unique: true,
                reason: `Invite created by ${interaction.user.tag}`
            });
            const embed = new EmbedBuilder()
                .setColor('#57F287')
                .setTitle('🔗 لینکی بانگهێشتنامە')
                .setDescription(`لینکی بانگهێشتنامە دروستکرا: ${invite.url}`)
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ ناتوانم لینکی بانگهێشتنامە دروست بکەم.', ephemeral: true });
        }
    }
};
