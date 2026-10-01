const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permission_remove')
        .setDescription('لابردنی پێرمێشن لە بەکارهێنەر')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .addStringOption(o => o.setName('permission').setDescription('پێرمێشن').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const permission = interaction.options.getString('permission');
        const config = require('../../config');
        config.permissions = config.permissions || {};
        if (config.permissions[user.id]) {
            config.permissions[user.id] = config.permissions[user.id].filter(p => p !== permission);
        }
        return interaction.reply(`✅ پێرمێشنی **${permission}** لابرا لە ${user.tag}.`);
    },
};
