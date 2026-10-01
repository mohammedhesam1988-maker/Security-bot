const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('لیستی فەرمانەکان'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('📋 لیستی فەرمانەکان')
            .addFields(
                { name: '🔨 مۆدێرەیشن', value: '`/ban` `/softban` `/unban` `/kick` `/mute` `/unmute` `/clear`' },
                { name: '🔒 ئاسایش', value: '`/lock` `/unlock` `/lockall` `/unlockall` `/enable` `/disable` `/settings` `/setlimit` `/setpunishment` `/setmuterole` `/scan`' },
                { name: '📋 لیستی سپی', value: '`/whitelist_add_user` `/whitelist_remove_user` `/whitelist_add_role` `/whitelist_remove_role` `/whitelist_add_channel` `/whitelist_remove_channel` `/whitelist_view_users` `/whitelist_view_roles` `/whitelist_view_channels`' },
                { name: '🔐 پشتڕاستکردنەوە', value: '`/verify` `/verification_enable` `/verification_disable` `/verification_reset` `/verification_type` `/verification_verify` `/verification_setup_channel` `/verification_setup_role`' },
                { name: '📊 ڕێکخستن', value: '`/permission_add` `/permission_remove` `/permission_reset` `/permission_reset_id` `/permission_view_user` `/permission_view_permission`' },
                { name: '📝 لۆگ', value: '`/logs_mod` `/logs_security`' },
                { name: '🔧 ئامراز', value: '`/help` `/invite` `/server` `/user` `/about`' }
            )
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' })
            .setTimestamp();
        return interaction.reply({ embeds: [embed] });
    },
};
