const { Giveaway, Settings } = require('../models.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client, config) {
        // ==================== SLASH COMMANDS ====================
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            if (config.utility && config.utility[interaction.commandName]) {
                const cmdSettings = config.utility[interaction.commandName];

                if (!cmdSettings.enabled) {
                    return interaction.reply({ content: '❌ This command is disabled.', ephemeral: true }).catch(() => {});
                }

                if (cmdSettings.enabledRoles && cmdSettings.enabledRoles.length > 0) {
                    if (!interaction.member.roles.cache.some(r => cmdSettings.enabledRoles.includes(r.id))) {
                        return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true }).catch(() => {});
                    }
                }

                if (cmdSettings.disabledRoles && cmdSettings.disabledRoles.length > 0) {
                    if (interaction.member.roles.cache.some(r => cmdSettings.disabledRoles.includes(r.id))) {
                        return interaction.reply({ content: '❌ You are not allowed to use this command.', ephemeral: true }).catch(() => {});
                    }
                }

                if (cmdSettings.enabledChannels && cmdSettings.enabledChannels.length > 0) {
                    if (!cmdSettings.enabledChannels.includes(interaction.channel.id)) {
                        return interaction.reply({ content: '❌ This command cannot be used in this channel.', ephemeral: true }).catch(() => {});
                    }
                }

                if (cmdSettings.disabledChannels && cmdSettings.disabledChannels.length > 0) {
                    if (cmdSettings.disabledChannels.includes(interaction.channel.id)) {
                        return interaction.reply({ content: '❌ This command cannot be used in this channel.', ephemeral: true }).catch(() => {});
                    }
                }

                if (cmdSettings.maxLimit && cmdSettings.maxLimit > 0) {
                    if (!client.commandUsage) client.commandUsage = new Map();
                    const key = `${interaction.user.id}-${interaction.commandName}`;
                    const usage = client.commandUsage.get(key) || 0;

                    if (usage >= cmdSettings.maxLimit) {
                        return interaction.reply({ content: `❌ You have reached the max limit (${cmdSettings.maxLimit}) for this command.`, ephemeral: true }).catch(() => {});
                    }
                    client.commandUsage.set(key, usage + 1);
                }
            }

            try {
                await command.execute(interaction, client, config);
            } catch (error) {
                console.error(`Command Error (${interaction.commandName}): ${error.message}`);
                if (interaction.replied && interaction.deferred) {
                    await interaction.reply({ content: '❌ There was an error while executing this command.', ephemeral: true }).catch(() => {});
                }
            }
        }

        // ==================== AUTOCOMPLETE ====================
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command || !command.autocomplete) return;
            try {
                await command.autocomplete(interaction, client, config);
            } catch (error) {
                console.error(`Autocomplete Error: ${error.message}`);
            }
        }

        // ==================== BUTTONS ====================
        if (interaction.isButton()) {
            try {
                const customId = interaction.customId;

                if (customId === 'verify_button') {
                    const { handleVerificationButton } = require('../handlers/verification');
                    await handleVerificationButton(interaction, config);
                }

                if (customId === 'ticket_close') {
                    const { closeTicket } = require('../handlers/ticketSystem');
                    await closeTicket(interaction, config);
                }

                // ==================== GIVEAWAY JOIN ====================
                if (customId === 'giveaway_join') {
                    const giveaway = await Giveaway.findOne({
                        guildId: interaction.guild.id,
                        messageId: interaction.message.id,
                        ended: false
                    });

                    if (!giveaway) {
                        return interaction.reply({
                            content: '❌ خەڵاتکردنەکە کۆتاییهاتووە.',
                            ephemeral: true
                        }).catch(() => {});
                    }

                    if (giveaway.participants.includes(interaction.user.id)) {
                        return interaction.reply({
                            content: '❌ تۆ پێشتر بەشداریت کردووە!',
                            ephemeral: true
                        }).catch(() => {});
                    }

                    giveaway.participants.push(interaction.user.id);
                    await giveaway.save();

                    await interaction.reply({
                        content: '✅ بە سەرکەوتوویی بەشداریت کرد!',
                        ephemeral: true
                    }).catch(() => {});
                }
            } catch (error) {
                console.error(`Button Error: ${error.message}`);
            }
        }

        // ==================== SELECT MENUS ====================
        if (interaction.isStringSelectMenu()) {
            try {
                const customId = interaction.customId;

                // ==================== REACTION ROLES ====================
                if (customId.startsWith('reactionrole_')) {
                    const roleId = interaction.values[0];
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (role) {
                        if (interaction.member.roles.cache.has(roleId)) {
                            await interaction.member.roles.remove(role).catch(() => {});
                            await interaction.reply({ content: `❌ Removed role: ${role.name}`, ephemeral: true }).catch(() => {});
                        } else {
                            await interaction.member.roles.add(role).catch(() => {});
                            await interaction.reply({ content: `✅ Added role: ${role.name}`, ephemeral: true }).catch(() => {});
                        }
                    }
                }

                // ==================== COLOR ROLES ====================
                if (customId === 'colorrole_select') {
                    const roleId = interaction.values[0];
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (!role) {
                        return interaction.reply({ content: '❌ ڕۆڵەکە نەدۆزرایەوە.', ephemeral: true }).catch(() => {});
                    }

                    const settings = await Settings.findOne({ guildId: interaction.guild.id });
                    const existingRoles = Object.values(settings?.colorRoles?.roles || {});

                    for (const existingRoleId of existingRoles) {
                        if (interaction.member.roles.cache.has(existingRoleId)) {
                            await interaction.member.roles.remove(existingRoleId).catch(() => {});
                        }
                    }

                    await interaction.member.roles.add(role).catch(() => {});
                    await interaction.reply({ content: `✅ ڕەنگەکەت گۆڕدرا بۆ: **${role.name}**`, ephemeral: true }).catch(() => {});
                }
            } catch (error) {
                console.error(`Select Menu Error: ${error.message}`);
            }
        }

        // ==================== MODALS ====================
        if (interaction.isModalSubmit()) {
            try {
                console.log(`Modal Submitted: ${interaction.customId}`);
            } catch (error) {
                console.error(`Modal Error: ${error.message}`);
            }
        }
    }
};
