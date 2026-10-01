const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('لابردنی بان')
        .addStringOption(o => o.setName('userid').setDescription('ئایدی').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        try {
            await interaction.guild.members.unban(userId);
            return interaction.reply('✅ لە بان دەرکرا.');
        } catch {
            return interaction.reply({ content: '❌ نەتوانرا.', ephemeral: true });
        }
    },
};
