const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permission_view_user')
        .setDescription('بینینی پێرمێشنەکانی بەکارهێنەر')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const config = require('../../config');
        config.permissions = config.permissions || {};
        const perms = config.permissions[user.id] || [];
        const list = perms.length > 0 ? perms.join('\n') : 'هیچ';
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`🔐 پێرمێشنەکانی ${user.tag}`)
            .setDescription(list)
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' });
        return interaction.reply({ embeds: [embed] });
    },
};
