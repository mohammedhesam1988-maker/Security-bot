const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmuterole')
        .setDescription('دانانی ڕۆڵی تایم ئاوت')
        .addRoleOption(o => o.setName('role').setDescription('ڕۆڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const config = require('../../config');
        config.muteRoleId = role.id;
        return interaction.reply(`✅ ڕۆڵی تایم ئاوت دانرا بۆ **${role.name}**.`);
    },
};
