const { sendLog } = require('../handlers/logger');

module.exports = {
    name: 'emojiCreate',
    once: false,
    async execute(emoji, client, config) {
        if (!emoji.guild) return;
        try {
            await sendLog(emoji.guild, '😀 Emoji Created', `**Name:** ${emoji.name}\n**ID:** ${emoji.id}`, '#22C55E');
        } catch (e) {
            console.error(`Emoji Create Log Error: ${e.message}`);
        }
    }
};
