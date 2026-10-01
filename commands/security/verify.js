const { SlashCommandBuilder } = require('discord.js');
const { handleVerificationButton } = require('../../handlers/verification');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('پشتڕاستکردنەوەی خۆت'),
    async execute(interaction) {
        return handleVerificationButton(interaction);
    },
};
