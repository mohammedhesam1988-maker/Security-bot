const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('A server based points that can be given by moderators.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user')
                .setRequired(false)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🏆 Points')
            .setDescription(`**${user.tag}** has **0** points.`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
