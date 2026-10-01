const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_remove_role')
        .setDescription('لابردنی ڕۆڵ لە لیستی سپی')
        .addRoleOption(o => o.setName('role').setDescription('ڕۆڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const config = require('../../config');
        config.trustedRoleIds = config.trustedRoleIds.filter(id => id !== role.id);
        return interaction.reply(`✅ ${role.name} لابرا لە لیستی سپی.`);
    },
};
