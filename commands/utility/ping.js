const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test the bot response time.'),
    async execute(interaction, client, config) {
        const ping = client.ws.ping;
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🏓 Pong!')
            .setDescription(`Bot Latency: **${ping}ms**`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
