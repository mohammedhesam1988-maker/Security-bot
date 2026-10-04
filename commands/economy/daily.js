const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { User } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('خەڵاتی ڕۆژانەت وەربگرە'),
    async execute(interaction, client, config) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;
        const now = new Date();
        try {
            let userData = await User.findOne({ userId, guildId });
            if (!userData) userData = new User({ userId, guildId });
            if (userData.lastDaily) {
                const diff = now - new Date(userData.lastDaily);
                const hours = 24 * 60 * 60 * 1000;
                if (diff < hours) {
                    const remaining = hours - diff;
                    const h = Math.floor(remaining / 3600000);
                    const m = Math.floor((remaining % 3600000) / 60000);
                    return interaction.reply({ content: `❌ تۆ پێشتر وەرگرتووە. چاوەڕوان بە **${h} کاتژمێر و ${m} خولەک**.`, ephemeral: true });
                }
            }
            userData.balance += 100;
            userData.lastDaily = now;
            userData.dailyStreak += 1;
            await userData.save();
            const embed = new EmbedBuilder().setColor('#FFD700').setTitle('💰 خەڵاتی ڕۆژانە').setDescription(`تۆ **100** گۆڵدت وەرگرت!`).addFields({ name: 'باڵانس', value: `${userData.balance}`, inline: true }, { name: 'ڕۆژی پێکەوە', value: `${userData.dailyStreak}`, inline: true }).setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
