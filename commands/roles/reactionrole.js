const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { ReactionRole } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('دروستکردنی پەیامی ڕۆڵی کاردانەوە')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addChannelOption(opt =>
            opt.setName('channel')
                .setDescription('ئەو چانێلەی کە پەیامەکە دەنێردرێت')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('title')
                .setDescription('ناونیشانی پەیامەکە')
                .setRequired(true))
        .addRoleOption(opt =>
            opt.setName('role')
                .setDescription('ئەو ڕۆڵەی کە دەدرێت')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('emoji')
                .setDescription('ئیمۆجییەک کە بەکاری دەهێنیت')
                .setRequired(true)),
    async execute(interaction, client, config) {
        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const role = interaction.options.getRole('role');
        const emoji = interaction.options.getString('emoji');

        try {
            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle(title)
                .setDescription(`بە ${emoji} کاردانەوە بکە بۆ وەرگرتنی ڕۆڵی **${role.name}**.`)
                .setTimestamp();

            const message = await channel.send({ embeds: [embed] });
            await message.react(emoji);

            const reactionRole = new ReactionRole({
                guildId: interaction.guild.id,
                messageId: message.id,
                channelId: channel.id,
                emoji: emoji,
                roleId: role.id
            });
            await reactionRole.save();

            return interaction.reply({ content: `✅ پەیامی ڕۆڵی کاردانەوە دروستکرا لە ${channel}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
