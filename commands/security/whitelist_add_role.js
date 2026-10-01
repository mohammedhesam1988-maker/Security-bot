const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_add_role')
        .setDescription('زیادکردنی ڕۆڵ بۆ لیستی سپی')
        .addRoleOption(o => o.setName('role').setDescription('ڕۆڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const config = require('../../config');
        if (!config.trustedRoleIds.includes(role.id)) {
            config.trustedRoleIds.push(role.id);
        }
        return interaction.reply(`✅ ${role.name} زیادکرا بۆ لیستی سپی.`);
    },
};
