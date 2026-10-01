const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolling dice.')
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('Number of sides (default: 6)')
                .setRequired(false)),
    async execute(interaction, client, config) {
        const sides = interaction.options.getInteger('sides') || 6;
        const result = Math.floor(Math.random() * sides) + 1;

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🎲 Dice Roll')
            .setDescription(`You rolled a **${result}** (1-${sides})`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
