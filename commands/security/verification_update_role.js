const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification_update_role')
        .setDescription('نوێکردنەوەی ڕۆڵی پشتڕاستکردنەوە')
        .addRoleOption(o => o.setName('role').setDescription('ڕۆڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const config = require('../../config');
        config.verification = config.verification || {};
        config.verification.unverifiedRoleId = role.id;
        return interaction.reply(`✅ ڕۆڵی نەپشتڕاستکراو نوێکرایەوە بۆ **${role.name}**.`);
    },
};
