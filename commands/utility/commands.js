const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('لیستی هەموو ئەو فەرمانانەی کە بۆتەکە پێشکەشی دەکات'),
    async execute(interaction, client, config) {
        try {
            const commands = client.commands.map(cmd => `\`/${cmd.data.name}\``).join(', ');
            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('📜 لیستی هەموو کۆماندەکان')
                .setDescription(commands || 'هیچ کۆماندێک نییە.')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
