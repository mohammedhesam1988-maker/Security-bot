const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('زانیاری بەکارهێنەر')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`ℹ️ زانیاری ${user.tag}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'ناو', value: user.username, inline: true },
                { name: 'ئایدی', value: user.id, inline: true },
                { name: 'ڕۆڵ', value: member.roles.cache.map(r => r.name).join(', ') || 'هیچ' }
            )
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' });
        return interaction.reply({ embeds: [embed] });
    },
};
