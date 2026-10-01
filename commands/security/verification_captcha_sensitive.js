const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_captcha_sensitive')
        .setDescription('چالاک/ناچالاککردنی هەستیاری CAPTCHA')
        .addBooleanOption(o => o.setName('enabled').setDescription('چالاک').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const enabled = interaction.options.getBoolean('enabled');
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.captchaSensitive = enabled;
        return interaction.reply(`✅ هەستیاری CAPTCHA ${enabled ? 'چالاک' : 'ناچالاک'} کرا.`);
    },
};
