const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_view_channels')
        .setDescription('بینینی کەناڵەکانی لیستی سپی')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const config = require('../../config');
        const list = config.whitelist.channels.map(id => `<#${id}>`).join('\n') || 'هیچ';
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('📋 کەناڵەکانی لیستی سپی')
            .setDescription(list)
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' });
        return interaction.reply({ embeds: [embed] });
    },
};
