const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs_security')
        .setDescription('دانانی کەناڵی لۆگی ئاسایش')
        .addChannelOption(o => o.setName('channel').setDescription('کەناڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const config = require('../../config');
        config.securityLogChannelId = channel.id;
        return interaction.reply(`✅ کەناڵی لۆگی ئاسایش دانرا بۆ ${channel}.`);
    },
};
