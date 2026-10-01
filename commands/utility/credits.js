const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('Show your or somebody else\'s balance.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user')
                .setRequired(false)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('💰 Credits')
            .setDescription(`**${user.tag}** has **0** credits.`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
