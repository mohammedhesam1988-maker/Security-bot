const { Giveaway, Settings } = require('../models.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client, config) {
        // ================= SLASH COMMANDS =================
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            // ================= چێککردنی فەرمانەکان =================
            const { checkChannel, checkRoles, checkLimit, checkWhitelistLimit } = require('../handlers/commandHandler.js');

            const channelCheck = await checkChannel(interaction, interaction.commandName, config);
            if (!channelCheck) return;

            const roleCheck = await checkRoles(interaction, interaction.commandName, config);
            if (!roleCheck) return;

            const limitCheck = await checkLimit(interaction, interaction.commandName, config);
            if (!limitCheck) return;

            const whitelistCheck = await checkWhitelistLimit(interaction, interaction.commandName, config);
            if (!whitelistCheck) return;

            try {
                await command.execute(interaction, client, config);
            } catch (error) {
                console.error(`Command Error (${interaction.commandName}): ${error.message}`);
                if (interaction.replied && interaction.deferred) {
                    await interaction.reply({ content: '❌ There was an error while executing this command.', ephemeral: true }).catch(() => {});
                }
            }
        }

        // ================= AUTOCOMPLETE =================
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command || !command.autocomplete) return;
            try {
                await command.autocomplete(interaction, client, config);
            } catch (error) {
                console.error(`Autocomplete Error: ${error.message}`);
            }
        }

        // ================= BUTTONS =================
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

                // ================= GIVEAWAY JOIN =================
                if (customId === 'giveaway_join') {
                    const giveaway = await Giveaway.findOne({
                        guildId: interaction.guild.id,
                        messageId: interaction.message.id,
                        ended: false
                    });

                    if (!giveaway) {
                        return interaction.reply({
                            content: '❌ ئەم خەڵاتە کۆتایی هاتووە.',
                            ephemeral: true
                        }).catch(() => {});
                    }

                    if (giveaway.participants.includes(interaction.user.id)) {
                        return interaction.reply({
                            content: '❌ تۆ بەشداربوویت.',
                            ephemeral: true
                        }).catch(() => {});
                    }

                    giveaway.participants.push(interaction.user.id);
                    await giveaway.save();

                    await interaction.reply({
                        content: '✅ بە سەرکەوتوویی بەشداربوویت.',
                        ephemeral: true
                    }).catch(() => {});
                }
            } catch (error) {
                console.error(`Button Error: ${error.message}`);
            }
        }

        // ================= SELECT MENUS =================
        if (interaction.isStringSelectMenu()) {
            try {
                const customId = interaction.customId;

                // ================= REACTION ROLES =================
                if (customId.startsWith('reactionrole_')) {
                    const roleId = interaction.values[0];
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (role) {
                        if (interaction.member.roles.cache.has(role.id)) {
                            await interaction.member.roles.remove(role).catch(() => {});
                            await interaction.reply({ content: `❌ Removed role: ${role.name}`, ephemeral: true }).catch(() => {});
                        } else {
                            await interaction.member.roles.add(role).catch(() => {});
                            await interaction.reply({ content: `✅ Added role: ${role.name}`, ephemeral: true }).catch(() => {});
                        }
                    }
                }

                // ================= COLOR ROLES =================
                if (customId === 'colorrole_select') {
                    const roleId = interaction.values[0];
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (!role) {
                        return interaction.reply({ content: '❌ ڕۆڵەکە نەدۆزرایەوە.', ephemeral: true }).catch(() => {});
                    }

                    const settings = await Settings.findOne({ guildId: interaction.guild.id });
                    const existingRoles = Object.values(settings?.colorRoles?.roles || {});

                    // سڕینەوەی ڕۆڵە کۆنەکان
                    for (const existingRoleId of existingRoles) {
                        if (interaction.member.roles.cache.has(existingRoleId)) {
                            await interaction.member.roles.remove(existingRoleId).catch(() => {});
                        }
                    }

                    // زیادکردنی ڕۆڵی نوێ
                    await interaction.member.roles.add(role).catch(() => {});
                    await interaction.reply({ content: `✅ ڕۆڵی ڕەنگ زیادکرا: **${role.name}**`, ephemeral: true }).catch(() => {});
                }
            } catch (error) {
                console.error(`Select Menu Error: ${error.message}`);
            }
        }

        // ================= MODALS =================
        if (interaction.isModalSubmit()) {
            try {
                console.log(`Modal Submitted: ${interaction.customId}`);
            } catch (error) {
                console.error(`Modal Error: ${error.message}`);
            }
        }
    }
};
