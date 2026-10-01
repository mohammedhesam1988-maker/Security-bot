const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('short')
        .setDescription('Shortens a URL.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL to shorten')
                .setRequired(true)),
    async execute(interaction, client, config) {
        const url = interaction.options.getString('url');

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🔗 URL Shortener')
            .setDescription(`**Original:** ${url}\n**Shortened:** ${url}`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
