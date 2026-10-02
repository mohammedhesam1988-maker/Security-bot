const { logMessage } = require('../handlers/logger');
const { checkSpam, checkInvites, checkLinks, checkPhishing, checkBannedWords, checkCaps, checkEmoji, checkMentions, checkDuplicates, checkZalgo, checkCharRepeat, checkPersonalInfo, checkMassMention } = require('../handlers/antiSpam');
const { addXP } = require('../handlers/levelSystem');
const { Level } = require('../models.js');

const dmCooldown = new Map();

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client, config) {
        // ==================== پشکنینی بۆت ====================
        if (message.author.bot) return;

        // ==================== پشکنینی DM ====================
        if (!message.guild) {
            const now = Date.now();
            const cd = dmCooldown.get(message.author.id);
            if (!cd || now - cd > 10000) {
                dmCooldown.set(message.author.id, now);
                await message.reply('❌ This bot cannot be used in DMs.').catch(() => {});
            }
            return;
        }

        // ==================== پشکنینی Whitelist ====================
        if (config.whitelist && config.whitelist.users && config.whitelist.users.all) {
            if (config.whitelist.users.all.includes(message.author.id)) return;
        }
        if (config.whitelist && config.whitelist.roles && config.whitelist.roles.all) {
            if (message.member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return;
        }

        // ==================== پشکنینی Anti-Spam ====================
        if (await checkSpam(message, config)) return;
        if (await checkInvites(message, config)) return;
        if (await checkLinks(message, config)) return;
        if (await checkPhishing(message, config)) return;
        if (await checkBannedWords(message, config)) return;
        if (await checkCaps(message, config)) return;
        if (await checkEmoji(message, config)) return;
        if (await checkMentions(message, config)) return;
        if (await checkDuplicates(message, config)) return;
        if (await checkZalgo(message, config)) return;
        if (await checkCharRepeat(message, config)) return;
        if (await checkPersonalInfo(message, config)) return;
        if (await checkMassMention(message, config)) return;

        // ==================== پشکنینی فەرمانەکان (Prefix) ====================
        if (config.prefix && message.content.startsWith(config.prefix)) {
            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (config.utility && config.utility[commandName]) {
                const cmdSettings = config.utility[commandName];

                if (!cmdSettings.enabled) return;

                if (cmdSettings.enabledRoles && cmdSettings.enabledRoles.length > 0) {
                    if (!message.member.roles.cache.some(r => cmdSettings.enabledRoles.includes(r.id))) return;
                }
                if (cmdSettings.disabledRoles && cmdSettings.disabledRoles.length > 0) {
                    if (message.member.roles.cache.some(r => cmdSettings.disabledRoles.includes(r.id))) return;
                }

                if (cmdSettings.enabledChannels && cmdSettings.enabledChannels.length > 0) {
                    if (!cmdSettings.enabledChannels.includes(message.channel.id)) return;
                }
                if (cmdSettings.disabledChannels && cmdSettings.disabledChannels.length > 0) {
                    if (cmdSettings.disabledChannels.includes(message.channel.id)) return;
                }

                if (cmdSettings.autoDeleteInvocation) {
                    setTimeout(() => message.delete().catch(() => {}), 1000);
                }
            }
        }

        // ==================== تۆمارکردنی پەیام (Logs) ====================
        if (config.logChannels && config.logChannels.general) {
            try {
                await logMessage(message, 'create');
            } catch (e) {
                console.error(`Message Log Error: ${e.message}`);
            }
        }

        // ==================== سیستەمی ئاست (Levels) ====================
        try {
            await addXP(message.member, message, config);
        } catch (error) {
            console.error(`Level System Error: ${error.message}`);
        }
    }
};
