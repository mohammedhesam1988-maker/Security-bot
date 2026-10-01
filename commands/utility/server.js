const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('زانیاری سێرڤەر'),
    async execute(interaction) {
        const guild = interaction.guild;
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`ℹ️ زانیاری ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: 'ناو', value: guild.name, inline: true },
                { name: 'ئایدی', value: guild.id, inline: true },
                { name: 'خاوەن', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'ئەندامان', value: `${guild.memberCount}`, inline: true },
                { name: 'کەناڵەکان', value: `${guild.channels.cache.size}`, inline: true },
                { name: 'ڕۆڵەکان', value: `${guild.roles.cache.size}`, inline: true }
            )
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' });
        return interaction.reply({ embeds: [embed] });
    },
};
