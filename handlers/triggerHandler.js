const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'triggerHandler',

    // ================= چێککردنی ترێگەر =================
    async checkTrigger(message, client, config) {
        try {
            // ئەگەر سیستەمی ترێگەر ناچالاک بێت
            if (!config.triggers || !config.triggers.enabled) return false;

            // ئەگەر نامەکە لە بۆت بێت
            if (message.author.bot) return false;

            // وەرگرتنی لیستی ترێگەرەکان
            const triggers = config.triggers.triggers || [];
            if (triggers.length === 0) return false;

            // پشکنینی چانێل و ڕۆڵ
            const whitelistRoles = config.triggers.whitelistRoles || [];
            const blacklistRoles = config.triggers.blacklistRoles || [];
            const whitelistChannels = config.triggers.whitelistChannels || [];
            const blacklistChannels = config.triggers.blacklistChannels || [];

            // ئەگەر چانێل لە blacklist دا بێت
            if (blacklistChannels.includes(message.channel.id)) return false;

            // ئەگەر چانێل لە whitelist دا نەبێت (ئەگەر whitelist بەتاڵ نەبێت)
            if (whitelistChannels.length > 0 && !whitelistChannels.includes(message.channel.id)) return false;

            // پشکنینی ڕۆڵەکان
            const memberRoles = message.member.roles.cache.map(r => r.id);

            // ئەگەر ڕۆڵ لە blacklist دا بێت
            if (blacklistRoles.some(r => memberRoles.includes(r))) return false;

            // ئەگەر ڕۆڵ لە whitelist دا نەبێت (ئەگەر whitelist بەتاڵ نەبێت)
            if (whitelistRoles.length > 0 && !whitelistRoles.some(r => memberRoles.includes(r))) return false;

            // پشکنینی هەموو ترێگەرەکان
            for (const trigger of triggers) {
                const matchType = trigger.matchType || config.triggers.matchType || 'normal';
                const caseSensitive = trigger.caseSensitive ?? config.triggers.caseSensitive ?? false;

                let content = message.content;
                let triggerText = trigger.trigger;

                if (!caseSensitive) {
                    content = content.toLowerCase();
                    triggerText = triggerText.toLowerCase();
                }

                let isMatch = false;

                // جۆرەکانی پشکنین
                if (matchType === 'normal') {
                    isMatch = content.includes(triggerText);
                } else if (matchType === 'exact') {
                    isMatch = content === triggerText;
                } else if (matchType === 'startsWith') {
                    isMatch = content.startsWith(triggerText);
                } else if (matchType === 'endsWith') {
                    isMatch = content.endsWith(triggerText);
                } else if (matchType === 'regex') {
                    try {
                        const regex = new RegExp(triggerText, caseSensitive ? '' : 'i');
                        isMatch = regex.test(message.content);
                    } catch (e) {
                        isMatch = false;
                    }
                }

                // ئەگەر ترێگەرەکە هاوتا بوو
                if (isMatch) {
                    // چێککردنی کۆتاڵتایم (cooldown)
                    if (config.triggers.cooldown > 0) {
                        if (!client.triggerCooldowns) client.triggerCooldowns = new Map();
                        const cooldownKey = `${message.author.id}-${trigger.trigger}`;
                        const lastUsed = client.triggerCooldowns.get(cooldownKey) || 0;
                        const now = Date.now();

                        if (now - lastUsed < config.triggers.cooldown) {
                            return false;
                        }

                        client.triggerCooldowns.set(cooldownKey, now);
                    }

                    // ناردنی وەڵام
                    await this.sendResponse(message, trigger, client, config);

                    // ئەگەر پێویست بێت نامەکە بسڕدرێتەوە
                    if (config.triggers.deleteAfter > 0) {
                        setTimeout(() => {
                            message.delete().catch(() => {});
                        }, config.triggers.deleteAfter);
                    }

                    // تۆمارکردنی لۆگ
                    await this.logTrigger(message, trigger, client, config);

                    return true;
                }
            }

            return false;

        } catch (error) {
            console.error('TriggerHandler Error:', error);
            return false;
        }
    },

    // ================= ناردنی وەڵام =================
    async sendResponse(message, trigger, client, config) {
        try {
            // ئەگەر وەڵام بە ئیمبێد بێت
            if (trigger.useEmbed || config.triggers.useEmbed) {
                const embed = new EmbedBuilder()
                    .setColor(trigger.embedColor || config.triggers.embedColor || '#5865F2')
                    .setDescription(trigger.response);

                if (trigger.title) embed.setTitle(trigger.title);
                if (trigger.footer) embed.setFooter({ text: trigger.footer });
                if (trigger.image) embed.setImage(trigger.image);
                if (trigger.thumbnail) embed.setThumbnail(trigger.thumbnail);

                if (config.triggers.replyToUser) {
                    await message.reply({ embeds: [embed] });
                } else {
                    await message.channel.send({ embeds: [embed] });
                }
            } else {
                // وەڵامی ئاسایی
                if (config.triggers.replyToUser) {
                    await message.reply(trigger.response);
                } else {
                    await message.channel.send(trigger.response);
                }
            }
        } catch (error) {
            console.error('Trigger Send Response Error:', error);
        }
    },

    // ================= تۆمارکردنی لۆگ =================
    async logTrigger(message, trigger, client, config) {
        try {
            if (!config.logChannels || !config.logChannels.triggerUsed) return;

            const logChannel = message.guild.channels.cache.get(config.logChannels.triggerUsed);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('🔔 ترێگەر بەکارهات')
                .addFields(
                    { name: 'بەکارهێنەر', value: `${message.author.tag} (${message.author.id})`, inline: true },
                    { name: 'چانێل', value: `${message.channel.name}`, inline: true },
                    { name: 'ترێگەر', value: trigger.trigger, inline: false },
                    { name: 'وەڵام', value: trigger.response.substring(0, 1024), inline: false }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Trigger Log Error:', error);
        }
    },

    // ================= زیادکردنی ترێگەر =================
    async addTrigger(triggerData, config) {
        try {
            if (!config.triggers.triggers) config.triggers.triggers = [];

            if (config.triggers.triggers.length >= config.triggers.maxTriggers) {
                return { success: false, message: 'زۆرترین ژمارەی ترێگەر پڕ بووە.' };
            }

            const exists = config.triggers.triggers.find(t => t.trigger === triggerData.trigger);
            if (exists) {
                return { success: false, message: 'ئەم ترێگەرە پێشتر هەیە.' };
            }

            config.triggers.triggers.push(triggerData);
            return { success: true, message: 'ترێگەرەکە زیادکرا.' };
        } catch (error) {
            console.error('Add Trigger Error:', error);
            return { success: false, message: 'هەڵەیەک ڕوویدا.' };
        }
    },

    // ================= سڕینەوەی ترێگەر =================
    async removeTrigger(triggerName, config) {
        try {
            if (!config.triggers.triggers) return { success: false, message: 'هیچ ترێگەرێک نییە.' };

            const index = config.triggers.triggers.findIndex(t => t.trigger === triggerName);
            if (index === -1) {
                return { success: false, message: 'ترێگەرەکە نەدۆزرایەوە.' };
            }

            config.triggers.triggers.splice(index, 1);
            return { success: true, message: 'ترێگەرەکە سڕدرایەوە.' };
        } catch (error) {
            console.error('Remove Trigger Error:', error);
            return { success: false, message: 'هەڵەیەک ڕوویدا.' };
        }
    },

    // ================= لیستی ترێگەرەکان =================
    async listTriggers(config) {
        try {
            if (!config.triggers.triggers || config.triggers.triggers.length === 0) {
                return { success: false, message: 'هیچ ترێگەرێک نییە.' };
            }

            return { success: true, triggers: config.triggers.triggers };
        } catch (error) {
            console.error('List Triggers Error:', error);
            return { success: false, message: 'هەڵەیەک ڕوویدا.' };
        }
    }
};
