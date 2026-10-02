const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Settings, Giveaway } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('🎁 دەستپێکردنی خەڵاتکردن')
        .addStringOption(option =>
            option.setName('prize')
                .setDescription('خەڵاتەکە چییە؟')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('ماوە بە خولەک')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('winners')
                .setDescription('ژمارەی براوەکان')
                .setRequired(false))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('چانێلی خەڵاتکردن')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const duration = interaction.options.getInteger('duration');
        const winners = interaction.options.getInteger('winners') || 1;
        const channelOption = interaction.options.getChannel('channel');
        const guild = interaction.guild;

        // ==================== وەرگرتنی ڕێکخستنەکان ====================
        let settings = await Settings.findOne({ guildId: guild.id });
        if (!settings) {
            settings = await Settings.create({ guildId: guild.id });
        }

        // ==================== پشکنینی چالاکی ====================
        if (!settings.giveaways?.enabled) {
            return interaction.reply({
                content: '❌ سیستەمی خەڵاتکردن لەم سێرڤەردا چالاک نییە.',
                ephemeral: true
            });
        }

        // ==================== دیاریکردنی چانێل ====================
        const targetChannel = channelOption || interaction.channel;
        const endTime = Date.now() + (duration * 60 * 1000);

        // ==================== دروستکردنی Embed ====================
        const embed = new EmbedBuilder()
            .setTitle(`🎁 خەڵاتکردن: ${prize}`)
            .setDescription(
                `**خەڵات:** ${prize}\n` +
                `**ماوە:** ${duration} خولەک\n` +
                `**براوەکان:** ${winners}\n\n` +
                `کلیک لەسەر دوگمەکە بکە بۆ بەشداریکردن!`
            )
            .setColor('#fbbf24')
            .setFooter({ text: `لەلایەن ${interaction.user.tag}` })
            .setTimestamp(endTime);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('giveaway_join')
                    .setLabel('🎉 بەشداریکردن')
                    .setStyle(ButtonStyle.Primary)
            );

        // ==================== ناردنی پەیام ====================
        const message = await targetChannel.send({
            embeds: [embed],
            components: [row]
        });

        // ==================== تۆمارکردنی خەڵاتکردن ====================
        const giveaway = await Giveaway.create({
            guildId: guild.id,
            channelId: targetChannel.id,
            messageId: message.id,
            prize: prize,
            winners: winners,
            endTime: new Date(endTime),
            hostId: interaction.user.id,
            participants: [],
            ended: false
        });

        await interaction.reply({
            content: `✅ خەڵاتکردن دەستیپێکرد لە <#${targetChannel.id}>`,
            ephemeral: true
        });
    }
};
