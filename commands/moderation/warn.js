const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Warning, Settings } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('⚠️ ئاگادارکردنەوەی ئەندامێک')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت ئاگاداری بکەیت')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('هۆکاری ئاگاداری')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'هیچ هۆکارێک دیارینەکراوە';
        const guild = interaction.guild;
        const member = await guild.members.fetch(target.id);

        // ==================== پشکنینەکان ====================
        if (!member) {
            return interaction.reply({ content: '❌ ئەم ئەندامە لەم سێرڤەرەدا نییە.', ephemeral: true });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({ content: '❌ ناتوانیت خۆت ئاگادار بکەیت.', ephemeral: true });
        }

        if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ ناتوانیت ئەدمینێک ئاگادار بکەیت.', ephemeral: true });
        }

        // ==================== تۆمارکردنی ئاگاداری ====================
        const warning = await Warning.create({
            guildId: guild.id,
            userId: target.id,
            moderatorId: interaction.user.id,
            reason: reason,
            timestamp: new Date()
        });

        // ==================== ناردنی پەیام ====================
        await interaction.reply({
            content:
                `⚠️ **ئاگاداری**\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `> **ئەندام:** ${target.tag}\n` +
                `> **هۆکار:** ${reason}\n` +
                `> **لەلایەن:** ${interaction.user.tag}\n` +
                `━━━━━━━━━━━━━━━━━━`
        });

        // ==================== پشکنینی سزای خۆکار ====================
        const settings = await Settings.findOne({ guildId: guild.id });
        if (settings?.moderation?.enabled) {
            const warnings = await Warning.countDocuments({ guildId: guild.id, userId: target.id });
            const maxWarns = settings.moderation?.maxWarns || 3;
            const punishment = settings.moderation?.punishment || 'timeout';

            if (warnings >= maxWarns) {
                // سزادان
                if (punishment === 'timeout') {
                    await member.timeout(10 * 60 * 1000, 'زۆرترین ئاگاداری');
                } else if (punishment === 'kick') {
                    await member.kick('زۆرترین ئاگاداری');
                } else if (punishment === 'ban') {
                    await member.ban({ reason: 'زۆرترین ئاگاداری' });
                }

                await interaction.followUp({
                    content: `🚨 **سزای خۆکار**\n> **ئەندام:** ${target.tag}\n> **سزا:** ${punishment}`
                });
            }
        }
    }
};
