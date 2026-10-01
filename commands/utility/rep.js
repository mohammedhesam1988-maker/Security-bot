const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rep')
        .setDescription('Award someone a reputation point. Can only be used once every 24 hours.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user')
                .setRequired(true)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user');

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot give reputation to yourself.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#57F287')
            .setTitle('⭐ Reputation')
            .setDescription(`You gave a reputation point to **${user.tag}**!`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
