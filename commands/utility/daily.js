const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Get the daily reward link and know when you can claim it again.'),
    async execute(interaction, client, config) {
        const embed = new EmbedBuilder()
            .setColor('#57F287')
            .setTitle('🎁 Daily Reward')
            .setDescription('You can claim your daily reward now!')
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
