const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_setup_channel')
        .setDescription('ڕێکخستنی کەناڵی پشتڕاستکردنەوە')
        .addChannelOption(o => o.setName('channel').setDescription('کەناڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.channelId = channel.id;
        return interaction.reply(`✅ کەناڵی پشتڕاستکردنەوە دانرا بۆ ${channel}.`);
    },
};
