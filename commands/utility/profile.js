const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your or someone else\'s customizable personal global profile card.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user')
                .setRequired(false)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`👤 ${user.tag}'s Profile`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'ID', value: user.id, inline: true },
                { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
