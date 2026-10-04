const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Welcome } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('چالاککردن یان ناچالاککردنی نامەی بەخێرهاتن')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub => sub.setName('channel').setDescription('دانانی چانێلی بەخێرهاتن').addChannelOption(o => o.setName('channel').setDescription('چانێل').setRequired(true)))
        .addSubcommand(sub => sub.setName('message').setDescription('دانانی نامەی بەخێرهاتن').addStringOption(o => o.setName('text').setDescription('{user} و {server} بەکاربهێنە').setRequired(true)))
        .addSubcommand(sub => sub.setName('toggle').setDescription('چالاککردن یان ناچالاککردن').addBooleanOption(o => o.setName('enabled').setDescription('چالاک یان ناچالاک').setRequired(true))),
    async execute(interaction, client, config) {
        const sub = interaction.options.getSubcommand();
        try {
            let welcomeData = await Welcome.findOne({ guildId: interaction.guild.id });
            if (!welcomeData) welcomeData = new Welcome({ guildId: interaction.guild.id });
            if (sub === 'channel') {
                const channel = interaction.options.getChannel('channel');
                welcomeData.channelId = channel.id;
                await welcomeData.save();
                return interaction.reply({ content: `✅ چانێلی بەخێرهاتن دانرا بۆ ${channel}.`, ephemeral: true });
            }
            if (sub === 'message') {
                welcomeData.message = interaction.options.getString('text');
                await welcomeData.save();
                return interaction.reply({ content: `✅ نامەی بەخێرهاتن نۆژەنکرایەوە.`, ephemeral: true });
            }
            if (sub === 'toggle') {
                welcomeData.enabled = interaction.options.getBoolean('enabled');
                await welcomeData.save();
                return interaction.reply({ content: `✅ سیستەمی بەخێرهاتن ${welcomeData.enabled ? 'چالاککرا' : 'ناچالاککرا'}.`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵە.', ephemeral: true });
        }
    }
};
