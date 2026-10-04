const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addemojis')
        .setDescription('زیادکردنی ئیمۆجی لە سێرڤەرەکانی تر یان وێنەی هاوپێچکراو')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers)
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('ئەو ئیمۆجییەی کە دەتەوێت زیاد بکەیت (وەک <:name:id>)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('ناوی ئیمۆجییەکە')
                .setRequired(true)),
    async execute(interaction, client, config) {
        const emoji = interaction.options.getString('emoji');
        const name = interaction.options.getString('name');
        try {
            const emojiRegex = /<a?:(\w+):(\d+)>/;
            const match = emoji.match(emojiRegex);
            if (!match) {
                return interaction.reply({ content: '❌ تکایە ئیمۆجییەکی دروست بنێرە.', ephemeral: true });
            }
            const emojiId = match[2];
            const animated = emoji.startsWith('<a:');
            const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${animated ? 'gif' : 'png'}`;
            const newEmoji = await interaction.guild.emojis.create({ attachment: emojiUrl, name: name });
            return interaction.reply({ content: `✅ ئیمۆجی **${newEmoji.name}** زیادکرا.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ ناتوانم ئیمۆجییەکە زیاد بکەم.', ephemeral: true });
        }
    }
};
