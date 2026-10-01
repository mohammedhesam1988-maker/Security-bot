const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('سڕینەوەی نامەکان')
        .addIntegerOption(o => o.setName('amount').setDescription('ژمارە (1-100)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        await interaction.channel.bulkDelete(amount, true);
        return interaction.reply({ content: `🧹 ${amount} نامە سڕدرانەوە.`, ephemeral: true });
    },
};
