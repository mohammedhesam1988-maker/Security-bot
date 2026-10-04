const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mutetext')
        .setDescription('بێدەنگکردنی دەقی ئەندامێک')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('ئەو بەکارهێنەرەی کە دەتەوێت بێدەنگی بکەیت')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('reason')
                .setDescription('هۆکار')
                .setRequired(false)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'هیچ هۆکارێک نەدراوە';
        const member = await interaction.guild.members.fetch(user.id);
        try {
            await member.timeout(10 * 60 * 1000, reason);
            return interaction.reply({ content: `✅ **${user.tag}** بێدەنگکرا لە دەق بۆ ١٠ خولەک.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ ناتوانم ئەندامەکە بێدەنگ بکەم.', ephemeral: true });
        }
    }
};
