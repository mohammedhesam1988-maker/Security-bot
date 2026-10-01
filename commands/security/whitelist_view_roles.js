const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_view_roles')
        .setDescription('بینینی ڕۆڵەکانی لیستی سپی')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const config = require('../../config');
        const list = config.trustedRoleIds.map(id => `<@&${id}>`).join('\n') || 'هیچ';
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('📋 ڕۆڵەکانی لیستی سپی')
            .setDescription(list)
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' });
        return interaction.reply({ embeds: [embed] });
    },
};
