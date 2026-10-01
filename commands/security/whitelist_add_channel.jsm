const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_add_channel')
        .setDescription('زیادکردنی کەناڵ بۆ لیستی سپی')
        .addChannelOption(o => o.setName('channel').setDescription('کەناڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const config = require('../../config');
        if (!config.whitelist.channels.includes(channel.id)) {
            config.whitelist.channels.push(channel.id);
        }
        return interaction.reply(`✅ ${channel} زیادکرا بۆ لیستی سپی.`);
    },
};
