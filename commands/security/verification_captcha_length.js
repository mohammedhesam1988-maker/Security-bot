const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_captcha_length')
        .setDescription('گۆڕینی درێژی CAPTCHA')
        .addIntegerOption(o => o.setName('length').setDescription('درێژی (4-10)').setRequired(true).setMinValue(4).setMaxValue(10))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const length = interaction.options.getInteger('length');
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.captchaLength = length;
        return interaction.reply(`✅ درێژی CAPTCHA گۆڕدرا بۆ **${length}**.`);
    },
};
