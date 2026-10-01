const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_add_user')
        .setDescription('زیادکردنی بەکارهێنەر بۆ لیستی سپی')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو بەکارهێنەرەی دەتەوێت زیاد بکەیت')
                .setRequired(true)),

    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user');

        // ١. دڵنیابوونەوە لەوەی کە پێکهاتەکە بوونی هەیە
        if (!config.whitelist) config.whitelist = { users: [], roles: [], channels: [] };
        if (!config.whitelist.users) config.whitelist.users = [];

        // ٢. پشکنین بۆ ئەوەی دووبارە زیاد نەکرێت
        if (config.whitelist.users.includes(user.id)) {
            return interaction.reply({ content: '❌ ئەم بەکارهێنەرە پێشتر لە لیستی سپیدایە.', ephemeral: true });
        }

        // ٣. زیادکردنی بەکارهێنەر
        config.whitelist.users.push(user.id);

        // ٤. پاشەکەوتکردنی گۆڕانکارییەکان لە فایلی config.js
        try {
            fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 4)};`);
        } catch (err) {
            console.error('Error saving config:', err);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا لە کاتی پاشەکەوتکردن.', ephemeral: true });
        }

        // ٥. ناردنی پەیامی سەرکەوتوو
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`✅ بەکارهێنەری **${user.tag}** زیادکرا بۆ لیستی سپی.`);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
