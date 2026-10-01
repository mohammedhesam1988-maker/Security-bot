const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_type')
        .setDescription('دانانی جۆری پشتڕاستکردنەوە')
        .addStringOption(o => o.setName('type').setDescription('جۆر').setRequired(true)
            .addChoices(
                { name: 'دوگمە', value: 'button' },
                { name: 'CAPTCHA', value: 'captcha' }
            ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const type = interaction.options.getString('type');
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.type = type;
        return interaction.reply(`✅ جۆری پشتڕاستکردنەوە گۆڕدرا بۆ **${type}**.`);
    },
};
