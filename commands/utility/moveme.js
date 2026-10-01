const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moveme')
        .setDescription('Moves you to another voice channel.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The voice channel')
                .setRequired(true)),
    async execute(interaction, client, config) {
        const channel = interaction.options.getChannel('channel');

        if (!channel || channel.type !== 2) {
            return interaction.reply({ content: '❌ Please select a valid voice channel.', ephemeral: true });
        }

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: '❌ You must be in a voice channel.', ephemeral: true });
        }

        try {
            await interaction.member.voice.setChannel(channel);
            await interaction.reply({ content: `✅ Moved you to ${channel.name}`, ephemeral: true });
        } catch (e) {
            await interaction.reply({ content: '❌ Failed to move you.', ephemeral: true });
        }
    }
};
