const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { User } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('بەڕێوەبردنی خاڵەکان')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('دانانی خاڵ بۆ بەکارهێنەرێک')
                .addUserOption(opt =>
                    opt.setName('user')
                        .setDescription('ئەو بەکارهێنەرەی کە دەتەوێت خاڵەکانی دیاری بکەیت')
                        .setRequired(true))
                .addIntegerOption(opt =>
                    opt.setName('amount')
                        .setDescription('بڕی خاڵەکان')
                        .setRequired(true))),
    async execute(interaction, client, config) {
        const sub = interaction.options.getSubcommand();
        if (sub === 'set') {
            const user = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount');
            try {
                let userData = await User.findOne({ userId: user.id, guildId: interaction.guild.id });
                if (!userData) userData = new User({ userId: user.id, guildId: interaction.guild.id });
                userData.balance = amount;
                await userData.save();
                return interaction.reply({ content: `✅ خاڵی **${user.tag}** دانرا بۆ **${amount}**.`, ephemeral: true });
            } catch (error) {
                console.error(error);
                return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
            }
        }
    }
};
