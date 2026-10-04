const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('گۆڕین یان سڕینەوەی ڕەنگی ئێستا')
        .addStringOption(option =>
            option.setName('hex')
                .setDescription('کۆدی ڕەنگی هێکس (وەک #FF0000)')
                .setRequired(true)),
    async execute(interaction, client, config) {
        const hex = interaction.options.getString('hex');
        const roleName = `Color-${interaction.user.id}`;
        const guild = interaction.guild;
        const member = interaction.member;
        try {
            if (!/^#[0-9A-F]{6}$/i.test(hex)) {
                return interaction.reply({ content: '❌ تکایە کۆدێکی هێکسی دروست بنووسە (وەک #FF0000).', ephemeral: true });
            }
            let role = guild.roles.cache.find(r => r.name === roleName);
            if (role) {
                await role.setColor(hex);
                if (!member.roles.cache.has(role.id)) {
                    await member.roles.add(role);
                }
                return interaction.reply({ content: `✅ ڕەنگی ڕۆڵەکەت گۆڕدرا بۆ **${hex}**.`, ephemeral: true });
            } else {
                role = await guild.roles.create({
                    name: roleName,
                    color: hex,
                    reason: `Color role for ${interaction.user.tag}`
                });
                await member.roles.add(role);
                return interaction.reply({ content: `✅ ڕۆڵی ڕەنگ دروستکرا و زیادکرا بۆ **${hex}**.`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا لە کاتی گۆڕینی ڕەنگ.', ephemeral: true });
        }
    }
};
