const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Settings } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('colorrole')
        .setDescription('🎨 ناردنی پەیامی هەڵبژاردنی ڕەنگ')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const guild = interaction.guild;

        // ==================== وەرگرتنی ڕێکخستنەکان ====================
        let settings = await Settings.findOne({ guildId: guild.id });
        if (!settings) {
            settings = await Settings.create({ guildId: guild.id });
        }

        // ==================== پشکنینی چالاکی ====================
        if (!settings.colorRoles?.enabled) {
            return interaction.reply({
                content: '❌ سیستەمی ڕۆڵی ڕەنگ لەم سێرڤەرەدا چالاک نییە.',
                ephemeral: true
            });
        }

        // ==================== پشکنینی ڕۆڵەکان ====================
        const roles = settings.colorRoles?.roles || {};
        const roleEntries = Object.entries(roles);

        if (roleEntries.length === 0) {
            return interaction.reply({
                content: '❌ هیچ ڕۆڵێکی ڕەنگ دیارینەکراوە. تکایە لە داشبۆردەکە ڕۆڵەکان زیاد بکە.',
                ephemeral: true
            });
        }

        // ==================== دروستکردنی لیستی هەڵبژاردن ====================
        const options = roleEntries.slice(0, 25).map(([name, roleId]) => ({
            label: name,
            value: roleId
        }));

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('colorrole_select')
                    .setPlaceholder('🎨 ڕەنگێک هەڵبژێرە')
                    .addOptions(options)
            );

        // ==================== ناردنی پەیام ====================
        await interaction.reply({
            content:
                `🎨 **هەڵبژاردنی ڕەنگ**\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `> لە لیستی خوارەوە ڕەنگێک هەڵبژێرە.\n` +
                `> دەتوانیت دووبارە کلیک بکەیت بۆ گۆڕینی ڕەنگەکە.\n` +
                `━━━━━━━━━━━━━━━━━━`,
            components: [row]
        });
    }
};
