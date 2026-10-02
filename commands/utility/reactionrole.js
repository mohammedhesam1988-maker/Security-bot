const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ReactionRole } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('🎭 دروستکردنی ڕۆڵی کاردانەوە')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('ناونیشانی پەیامەکە')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('دەقی پەیامەکە')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('ئەو ڕۆڵەی بەکارهێنەر وەریدەگرێت')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('ئیمۆجییەک بۆ هەڵبژاردن')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const role = interaction.options.getRole('role');
        const emoji = interaction.options.getString('emoji');

        // ==================== دروستکردنی Embed ====================
        const embed = new EmbedBuilder()
            .setTitle(`🎭 ${title}`)
            .setDescription(description)
            .setColor('#fbbf24')
            .setFooter({ text: 'کلیک لەسەر لیستی خوارەوە بکە بۆ وەرگرتنی ڕۆڵ' })
            .setTimestamp();

        // ==================== دروستکردنی لیستی هەڵبژاردن ====================
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('reactionrole_select')
                    .setPlaceholder('🎭 ڕۆڵێک هەڵبژێرە')
                    .addOptions([
                        {
                            label: role.name,
                            value: role.id,
                            emoji: emoji
                        }
                    ])
            );

        // ==================== ناردنی پەیام ====================
        const message = await interaction.channel.send({ embeds: [embed], components: [row] });

        // ==================== تۆمارکردنی ڕۆڵی کاردانەوە ====================
        await ReactionRole.create({
            guildId: interaction.guild.id,
            messageId: message.id,
            channelId: interaction.channel.id,
            emoji: emoji,
            roleId: role.id
        });

        await interaction.reply({ content: '✅ ڕۆڵی کاردانەوە دروستکرا.', ephemeral: true });
    }
};
