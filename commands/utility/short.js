const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('short')
        .setDescription('لینکەکان کورت بکەرەوە')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('لینکەکە')
                .setRequired(true)),
    async execute(interaction, client, config) {
        const url = interaction.options.getString('url');
        try {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                return interaction.reply({ content: '❌ تکایە لینکێکی دروست بنێرە.', ephemeral: true });
            }
            const shortUrl = `https://is.gd/${Buffer.from(url).toString('base64').slice(0, 6)}`;
            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('🔗 لینکی کورتکراوە')
                .setDescription(`[${shortUrl}](${url})`)
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
