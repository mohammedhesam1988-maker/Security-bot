const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_captcha_color')
        .setDescription('گۆڕینی ڕەنگی CAPTCHA')
        .addStringOption(o => o.setName('color').setDescription('ڕەنگ (hex)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const color = interaction.options.getString('color');
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.captchaColor = color;
        return interaction.reply(`✅ ڕەنگی CAPTCHA گۆڕدرا بۆ **${color}**.`);
    },
};
