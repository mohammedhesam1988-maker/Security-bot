// ==================== VERIFICATION HANDLER ====================

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// ==================== SEND VERIFICATION PANEL ====================
async function sendVerificationPanel(channel, config) {
    try {
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('✅ Verification')
            .setDescription('Click the button below to verify yourself and gain access to the server.')
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verify_button')
                    .setLabel('Verify')
                    .setStyle(ButtonStyle.Success)
            );

        await channel.send({ embeds: [embed], components: [row] }).catch(() => {});
    } catch (e) {
        console.error(`sendVerificationPanel Error: ${e.message}`);
    }
}

// ==================== HANDLE VERIFICATION BUTTON ====================
async function handleVerificationButton(interaction, config) {
    try {
        if (!config.verification || !config.verification.roleId) {
            return interaction.reply({
                content: '❌ Verification is not configured properly.',
                ephemeral: true
            });
        }

        const role = interaction.guild.roles.cache.get(config.verification.roleId);
        if (!role) {
            return interaction.reply({
                content: '❌ Verification role not found.',
                ephemeral: true
            });
        }

        if (interaction.member.roles.cache.has(role.id)) {
            return interaction.reply({
                content: '✅ You are already verified.',
                ephemeral: true
            });
        }

        await interaction.member.roles.add(role).catch(() => {});
        await interaction.reply({
            content: '✅ You have been verified successfully!',
            ephemeral: true
        });
    } catch (e) {
        console.error(`handleVerificationButton Error: ${e.message}`);
    }
}

// ==================== AUTO VERIFY NEW MEMBER ====================
async function autoVerifyNewMember(member) {
    try {
        const config = require('../config.js');
        if (!config.verification || !config.verification.enabled) return;
        if (!config.verification.roleId) return;

        const role = member.guild.roles.cache.get(config.verification.roleId);
        if (role) {
            await member.roles.add(role).catch(() => {});
        }
    } catch (e) {
        console.error(`autoVerifyNewMember Error: ${e.message}`);
    }
}

module.exports = {
    sendVerificationPanel,
    handleVerificationButton,
    autoVerifyNewMember
};
