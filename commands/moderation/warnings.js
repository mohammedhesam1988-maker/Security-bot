const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Warning } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('📋 بینینی ئاگادارییەکانی ئەندامێک')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت ئاگادارییەکانی ببینیت')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const warnings = await Warning.find({
            guildId: interaction.guild.id,
            userId: target.id
        }).sort({ timestamp: -1 });

        // ==================== پشکنین ====================
        if (warnings.length === 0) {
            return interaction.reply({
                content: `✅ **${target.tag}** هیچ ئاگادارییەکی نییە.`,
                ephemeral: true
            });
        }

        // ==================== دروستکردنی لیست ====================
        let list = '';
        warnings.forEach((w, i) => {
            const date = new Date(w.timestamp).toLocaleDateString('ku');
            list +=
                `**${i + 1}.** ${w.reason}\n` +
                `> 👤 لەلایەن: <@${w.moderatorId}>\n` +
                `> 📅 بەروار: ${date}\n\n`;
        });

        // ==================== ناردنی ئەنجام ====================
        await interaction.reply({
            content:
                `📋 **ئاگادارییەکانی ${target.tag}**\n` +
                `━━━━━━━━━━━━━━━━━━\n\n` +
                `${list}` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `**کۆی گشتی:** ${warnings.length} ئاگاداری`,
            ephemeral: true
        });
    }
};
