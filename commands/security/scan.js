const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scan')
        .setDescription('پشکنینی سێرڤەر بۆ هەڕەشە')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply();

        const guild = interaction.guild;
        const suspicious = [];

        // پشکنینی ئەندامانی نوێ
        const newMembers = guild.members.cache.filter(m => {
            const days = (Date.now() - m.user.createdTimestamp) / 86400000;
            return days < 7;
        });

        // پشکنینی ڕۆڵە مەترسیدارەکان
        const dangerousRoles = guild.roles.cache.filter(r =>
            r.permissions.has('Administrator') && !r.managed
        );

        // پشکنینی کەناڵەکان
        const totalChannels = guild.channels.cache.size;
        const totalRoles = guild.roles.cache.size;

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('🔍 پشکنینی سێرڤەر')
            .addFields(
                { name: 'ئەندامانی نوێ (٧ ڕۆژ)', value: `${newMembers.size}`, inline: true },
                { name: 'ڕۆڵە مەترسیدارەکان', value: `${dangerousRoles.size}`, inline: true },
                { name: 'کۆی کەناڵەکان', value: `${totalChannels}`, inline: true },
                { name: 'کۆی ڕۆڵەکان', value: `${totalRoles}`, inline: true }
            )
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
