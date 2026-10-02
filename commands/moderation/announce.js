const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Settings } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('📢 ناردنی ڕاگەیاندن')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('ناونیشانی ڕاگەیاندنەکە')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('دەقی ڕاگەیاندنەکە')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('ئەو چانێلەی ڕاگەیاندنەکە تێدا بنێردرێت')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const message = interaction.options.getString('message');
        const channelOption = interaction.options.getChannel('channel');
        const guild = interaction.guild;

        // ==================== وەرگرتنی ڕێکخستنەکان ====================
        let settings = await Settings.findOne({ guildId: guild.id });
        if (!settings) {
            settings = await Settings.create({ guildId: guild.id });
        }

        // ==================== پشکنینی چالاکی ====================
        if (!settings.announcements?.enabled) {
            return interaction.reply({
                content: '❌ سیستەمی ڕاگەیاندن لەم سێرڤەرەدا چالاک نییە.',
                ephemeral: true
            });
        }

        // ==================== دیاریکردنی چانێل ====================
        const targetChannel = channelOption || 
            (settings.announcements?.defaultChannel 
                ? guild.channels.cache.get(settings.announcements.defaultChannel) 
                : null);

        if (!targetChannel) {
            return interaction.reply({
                content: '❌ هیچ چانێلێک دیارینەکراوە. تکایە چانێلێک دیاری بکە یان لە داشبۆردەکە چانێلی ڕاگەیاندن دیاری بکە.',
                ephemeral: true
            });
        }

        // ==================== دروستکردنی Embed ====================
        const embed = new EmbedBuilder()
            .setTitle(`📢 ${title}`)
            .setDescription(message)
            .setColor(settings.announcements?.color || '#fbbf24')
            .setFooter({ text: `لەلایەن ${interaction.user.tag}` })
            .setTimestamp();

        // ==================== ناردنی ڕاگەیاندن ====================
        try {
            const mention = settings.announcements?.mentionEveryone ? '@everyone' : '';
            await targetChannel.send({
                content: mention,
                embeds: [embed]
            });

            await interaction.reply({
                content:
                    `✅ **ڕاگەیاندن نێردرا**\n` +
                    `━━━━━━━━━━━━━━━━━━\n` +
                    `> **چانێل:** <#${targetChannel.id}>\n` +
                    `> **ناونیشان:** ${title}\n` +
                    `━━━━━━━━━━━━━━━━━━`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ هەڵەیەک ڕوویدا لە کاتی ناردنی ڕاگەیاندنەکە.',
                ephemeral: true
            });
        }
    }
};
