const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_enable')
        .setDescription('چالاککردنی پشتڕاستکردنەوە')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.enabled = true;
        return interaction.reply('✅ پشتڕاستکردنەوە چالاک کرا.');
    },
};
