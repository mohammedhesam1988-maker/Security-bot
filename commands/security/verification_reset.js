const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_reset')
        .setDescription('ڕیسێتی ڕێکخستنەکانی پشتڕاستکردنەوە')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const config = require('../../config');
        config.verification = {
            enabled: false,
            channelId: null,
            roleId: null,
            type: 'button'
        };
        return interaction.reply('✅ پشتڕاستکردنەوە ڕیسێت کرا.');
    },
};
