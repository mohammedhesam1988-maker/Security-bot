const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permission_view_permission')
        .setDescription('بینینی بەکارهێنەرانی پێرمێشنێک')
        .addStringOption(o => o.setName('permission').setDescription('پێرمێشن').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const permission = interaction.options.getString('permission');
        const config = require('../../config');
        config.permissions = config.permissions || {};
        const users = Object.keys(config.permissions).filter(id =>
            config.permissions[id].includes(permission)
        );
        const list = users.length > 0 ? users.map(id => `<@${id}>`).join('\n') : 'هیچ';
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`🔐 بەکارهێنەرانی پێرمێشنی ${permission}`)
            .setDescription(list)
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' });
        return interaction.reply({ embeds: [embed] });
    },
};
