const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Level } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('🏆 لیستی باشترین ئەندامان'),

    async execute(interaction) {
        const guild = interaction.guild;

        // وەرگرتنی ١٠ ئەندامی باشتر
        const topUsers = await Level.find({ guildId: guild.id })
            .sort({ totalXp: -1 })
            .limit(10);

        if (topUsers.length === 0) {
            return interaction.reply({ content: '❌ هیچ داتایەک نییە.', ephemeral: true });
        }

        // ==================== دروستکردنی لیست ====================
        let list = '';
        for (let i = 0; i < topUsers.length; i++) {
            const user = await interaction.client.users.fetch(topUsers[i].userId).catch(() => null);
            const username = user ? user.username : 'Unknown';
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
            list += `${medal} ${username} — ئاست: **${topUsers[i].level}** | خاڵ: **${topUsers[i].totalXp}**\n`;
        }

        // ==================== دروستکردنی Embed ====================
        const embed = new EmbedBuilder()
            .setTitle('🏆 لیستی باشترین ئەندامان')
            .setDescription(list)
            .setColor('#fbbf24')
            .setFooter({ text: `لەلایەن ${interaction.client.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
