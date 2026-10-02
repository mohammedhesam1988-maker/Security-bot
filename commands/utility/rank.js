const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Level } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('📊 بینینی ئاستی خۆت')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت ئاستەکەی ببینیت')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        const guild = interaction.guild;

        // وەرگرتنی داتای ئاست
        let levelData = await Level.findOne({ guildId: guild.id, userId: target.id });
        
        if (!levelData) {
            levelData = await Level.create({
                guildId: guild.id,
                userId: target.id,
                xp: 0,
                level: 0,
                totalXp: 0,
                messages: 0,
                voiceMinutes: 0
            });
        }

        // ==================== دروستکردنی Embed ====================
        const embed = new EmbedBuilder()
            .setTitle(`📊 ئاستی ${target.username}`)
            .setColor('#fbbf24')
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🏆 ئاست', value: `${levelData.level}`, inline: true },
                { name: '✨ خاڵ', value: `${levelData.xp} / ${(levelData.level + 1) * 100}`, inline: true },
                { name: '💬 پەیامەکان', value: `${levelData.messages}`, inline: true },
                { name: '🎤 خولەکانی دەنگ', value: `${levelData.voiceMinutes}`, inline: true },
                { name: '📈 کۆی خاڵ', value: `${levelData.totalXp}`, inline: true }
            )
            .setFooter({ text: `لەلایەن ${interaction.client.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
