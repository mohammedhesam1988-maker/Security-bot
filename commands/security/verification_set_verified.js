const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_set_verified')
        .setDescription('دانانی ڕۆڵی پشتڕاستکراو')
        .addRoleOption(o => o.setName('role').setDescription('ڕۆڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.verifiedRoleId = role.id;
        return interaction.reply(`✅ ڕۆڵی پشتڕاستکراو دانرا بۆ **${role.name}**.`);
    },
};
