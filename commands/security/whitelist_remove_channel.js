const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_remove_channel')
        .setDescription('لابردنی کەناڵ لە لیستی سپی')
        .addChannelOption(o => o.setName('channel').setDescription('کەناڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const config = require('../../config');
        config.whitelist.channels = config.whitelist.channels.filter(id => id !== channel.id);
        return interaction.reply(`✅ ${channel} لابرا لە لیستی سپی.`);
    },
};
