const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('خێرایی بۆت بپشکنە'),
    async execute(interaction, client, config) {
        try {
            const sent = await interaction.reply({ content: '⏳ چاوەڕوان بە...', fetchReply: true });
            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            const embed = new EmbedBuilder()
                .setColor('#57F287')
                .setTitle('🏓 پۆنگ!')
                .addFields(
                    { name: 'کاتی وەڵامدانەوە', value: `${latency}ms`, inline: true },
                    { name: 'پینگی وێبسۆکێت', value: `${client.ws.ping}ms`, inline: true }
                )
                .setTimestamp();
            return interaction.editReply({ content: null, embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
