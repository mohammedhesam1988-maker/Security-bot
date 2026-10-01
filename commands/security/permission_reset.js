const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permission_reset')
        .setDescription('ڕیسێتی هەموو پێرمێشنەکانی بەکارهێنەر')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const config = require('../../config');
        config.permissions = config.permissions || {};
        config.permissions[user.id] = [];
        return interaction.reply(`✅ هەموو پێرمێشنەکانی ${user.tag} ڕیسێتکران.`);
    },
};
