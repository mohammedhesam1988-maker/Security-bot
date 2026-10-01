const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs_mod')
        .setDescription('دانانی کەناڵی لۆگی مۆدێرەیشن')
        .addChannelOption(o => o.setName('channel').setDescription('کەناڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const config = require('../../config');
        config.moderationLogChannelId = channel.id;
        return interaction.reply(`✅ کەناڵی لۆگی مۆدێرەیشن دانرا بۆ ${channel}.`);
    },
};
