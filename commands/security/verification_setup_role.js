const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_setup_role')
        .setDescription('ڕێکخستنی ڕۆڵی پشتڕاستکردنەوە')
        .addRoleOption(o => o.setName('role').setDescription('ڕۆڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.roleId = role.id;
        return interaction.reply(`✅ ڕۆڵی پشتڕاستکردنەوە دانرا بۆ **${role.name}**.`);
    },
};
