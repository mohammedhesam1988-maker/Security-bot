const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js');
const { version: nodeVersion } = require('process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('زانیاری دەربارەی بۆتەکە لەم سێرڤەرەدا بنێرە')
        .setDefaultMemberPermissions(8),
    async execute(interaction, client, config) {
        try {
            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('🛠️ زانیاری بۆت')
                .addFields(
                    { name: 'سێرڤەر', value: interaction.guild.name, inline: true },
                    { name: 'ئەندامان', value: `${interaction.guild.memberCount}`, inline: true },
                    { name: 'کۆماندەکان', value: `${client.commands.size}`, inline: true },
                    { name: 'وەشانی Discord.js', value: `${djsVersion}`, inline: true },
                    { name: 'وەشانی Node.js', value: `${nodeVersion}`, inline: true },
                    { name: 'پینگ', value: `${client.ws.ping}ms`, inline: true }
                )
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
