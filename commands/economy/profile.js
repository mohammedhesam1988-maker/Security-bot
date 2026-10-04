const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { User, Level } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('پرۆفایلی خۆت یان کەسێکی تر ببینە')
        .addUserOption(option => option.setName('user').setDescription('ئەو بەکارهێنەرەی کە دەتەوێت پرۆفایلەکەی ببینیت').setRequired(false)),
    async execute(interaction, client, config) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const guildId = interaction.guild.id;
        try {
            let userData = await User.findOne({ userId: targetUser.id, guildId });
            if (!userData) { userData = new User({ userId: targetUser.id, guildId }); await userData.save(); }
            let levelData = await Level.findOne({ userId: targetUser.id, guildId });
            if (!levelData) { levelData = new Level({ userId: targetUser.id, guildId }); await levelData.save(); }
            const embed = new EmbedBuilder()
                .setColor('#5865F2').setTitle(`👤 پرۆفایلی ${targetUser.username}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: '💰 باڵانس', value: `${userData.balance}`, inline: true },
                    { name: '🏦 بانک', value: `${userData.bank}`, inline: true },
                    { name: '⭐ ڕێپۆتەیشن', value: `${userData.rep}`, inline: true },
                    { name: '📊 ئاست', value: `${levelData.level}`, inline: true },
                    { name: '✨ ئێکسپی', value: `${levelData.xp}`, inline: true },
                    { name: '🔥 ڕۆژی پێکەوە', value: `${userData.dailyStreak}`, inline: true },
                    { name: '📝 دەربارەی من', value: userData.aboutMe || 'هیچ نییە', inline: false }
                ).setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
