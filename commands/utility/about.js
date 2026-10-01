const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('زانیاری بۆت'),
    async execute(interaction) {
        const client = interaction.client;
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('🛡️ Security Bot')
            .setDescription('بۆتێکی ئاسایشی پڕۆفیشناڵ بۆ دیسکۆرد.')
            .addFields(
                { name: 'ناو', value: client.user.tag, inline: true },
                { name: 'سێرڤەرەکان', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'ئەندامان', value: `${client.users.cache.size}`, inline: true },
                { name: 'کاتی چالاکی', value: `${Math.floor(client.uptime / 1000 / 60)} خولەک`, inline: true }
            )
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' });
        return interaction.reply({ embeds: [embed] });
    },
};
