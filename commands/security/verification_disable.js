const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_disable')
        .setDescription('ناچالاککردنی پشتڕاستکردنەوە')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.enabled = false;
        return interaction.reply('❌ پشتڕاستکردنەوە ناچالاک کرا.');
    },
};
