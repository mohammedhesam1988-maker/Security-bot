const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permission_reset_id')
        .setDescription('ڕیسێتی پێرمێشنەکان بە ئایدی')
        .addStringOption(o => o.setName('userid').setDescription('ئایدی بەکارهێنەر').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const config = require('../../config');
        config.permissions = config.permissions || {};
        config.permissions[userId] = [];
        return interaction.reply(`✅ هەموو پێرمێشنەکانی <@${userId}> ڕیسێتکران.`);
    },
};
