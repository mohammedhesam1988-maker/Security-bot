const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('بانەری بەکارهێنەر ببینە')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('بەکارهێنەر')
                .setRequired(false)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user') || interaction.user;
        try {
            const fetchedUser = await client.users.fetch(user.id, { force: true });
            if (!fetchedUser.banner) {
                return interaction.reply({ content: '❌ ئەم بەکارهێنەرە هیچ بانەرێکی نییە.', ephemeral: true });
            }
            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle(`🖼️ بانەری ${user.username}`)
                .setImage(fetchedUser.bannerURL({ dynamic: true, size: 1024 }))
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
