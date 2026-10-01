const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_captcha_timeout')
        .setDescription('گۆڕینی کاتی CAPTCHA')
        .addIntegerOption(o => o.setName('seconds').setDescription('چرکە (30-300)').setRequired(true).setMinValue(30).setMaxValue(300))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.captchaTimeout = seconds;
        return interaction.reply(`✅ کاتی CAPTCHA گۆڕدرا بۆ **${seconds}** چرکە.`);
    },
};
