const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addstickers')
        .setDescription('زیادکردنی ستیکەر لە سێرڤەرەکانی تر یان وێنەی هاوپێچکراو')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers)
        .addAttachmentOption(option =>
            option.setName('sticker')
                .setDescription('فایلی وێنەی ستیکەر')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('ناوی ستیکەرەکە')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tags')
                .setDescription('تاگەکان بۆ ستیکەرەکە (بە کۆما جیاکراوە)')
                .setRequired(true)),
    async execute(interaction, client, config) {
        const attachment = interaction.options.getAttachment('sticker');
        const name = interaction.options.getString('name');
        const tags = interaction.options.getString('tags');
        try {
            if (!attachment.contentType.startsWith('image/')) {
                return interaction.reply({ content: '❌ تکایە فایلێکی وێنە بنێرە.', ephemeral: true });
            }
            const sticker = await interaction.guild.stickers.create({
                file: attachment.url,
                name: name,
                tags: tags
            });
            return interaction.reply({ content: `✅ ستیکەر **${sticker.name}** زیادکرا.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ ناتوانم ستیکەرەکە زیاد بکەم.', ephemeral: true });
        }
    }
};
