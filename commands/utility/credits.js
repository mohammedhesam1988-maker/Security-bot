const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('دەستکەوتەکانی بۆت'),
    async execute(interaction, client, config) {
        try {
            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('🏆 دەستکەوتەکان')
                .setDescription('ئەم بۆتە بە دەستی تیمێکی بەهرەدار دروستکراوە.')
                .addFields(
                    { name: 'دروستکەر', value: 'Kboloorian', inline: true },
                    { name: 'وەشان', value: '1.0.0', inline: true }
                )
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
