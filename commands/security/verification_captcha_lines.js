const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_captcha_lines')
        .setDescription('چالاک/ناچالاککردنی هێڵەکانی CAPTCHA')
        .addBooleanOption(o => o.setName('enabled').setDescription('چالاک').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const enabled = interaction.options.getBoolean('enabled');
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.captchaLines = enabled;
        return interaction.reply(`✅ هێڵەکانی CAPTCHA ${enabled ? 'چالاک' : 'ناچالاک'} کرا.`);
    },
};
