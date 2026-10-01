const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Get the vote link and see when you can vote again.'),
    async execute(interaction, client, config) {
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🗳️ Vote')
            .setDescription('Vote for the bot to support us!')
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
