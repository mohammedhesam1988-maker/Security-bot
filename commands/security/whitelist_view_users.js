const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_view_users')
        .setDescription('بینینی ئەو بەکارهێنەرانەی لە لیستی سپیدان'),

    async execute(interaction, client, config) {
        // دڵنیابوونەوە لەوەی کە لیستەکە بوونی هەیە
        if (!config.whitelist || !config.whitelist.users || config.whitelist.users.length === 0) {
            return interaction.reply({ content: '📭 لیستی سپی بەتاڵە.', ephemeral: true });
        }

        const usersList = config.whitelist.users.map(id => `<@${id}>`).join('\n');

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('📋 لیستی سپی بەکارهێنەران')
            .setDescription(usersList);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
