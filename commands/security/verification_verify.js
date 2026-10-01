const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { manualVerify } = require('../../handlers/verification');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_verify')
        .setDescription('پشتڕاستکردنەوەی دەستی بەکارهێنەر')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        return manualVerify(interaction, user);
    },
};
