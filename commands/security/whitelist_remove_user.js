const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_remove_user')
        .setDescription('لابردنی بەکارهێنەر لە لیستی سپی')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const config = require('../../config');
        config.trustedUserIds = config.trustedUserIds.filter(id => id !== user.id);
        return interaction.reply(`✅ ${user.tag} لابرا لە لیستی سپی.`);
    },
};
