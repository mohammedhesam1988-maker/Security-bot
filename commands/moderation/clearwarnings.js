const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Warning } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarnings')
        .setDescription('🗑️ سڕینەوەی هەموو ئاگادارییەکانی ئەندامێک')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت ئاگادارییەکانی بسڕیتەوە')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const target = interaction.options.getUser('user');

        // ==================== سڕینەوە ====================
        const result = await Warning.deleteMany({
            guildId: interaction.guild.id,
            userId: target.id
        });

        // ==================== پشکنین ====================
        if (result.deletedCount === 0) {
            return interaction.reply({
                content: `✅ **${target.tag}** هیچ ئاگادارییەکی نییە بۆ سڕینەوە.`,
                ephemeral: true
            });
        }

        // ==================== ناردنی ئەنجام ====================
        await interaction.reply({
            content:
                `🗑️ **سڕینەوەی ئاگاداری**\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `> **ئەندام:** ${target.tag}\n` +
                `> **ژمارەی سڕاوە:** ${result.deletedCount}\n` +
                `> **لەلایەن:** ${interaction.user.tag}\n` +
                `━━━━━━━━━━━━━━━━━━`
        });
    }
};
