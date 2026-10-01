const { sendLog } = require('../handlers/logger');

module.exports = {
    name: 'emojiUpdate',
    once: false,
    async execute(oldEmoji, newEmoji, client, config) {
        if (!newEmoji.guild) return;
        try {
            await sendLog(newEmoji.guild, '✏️ Emoji Updated', `**Before:** ${oldEmoji.name}\n**After:** ${newEmoji.name}`, '#FBBF24');
        } catch (e) {
            console.error(`Emoji Update Log Error: ${e.message}`);
        }
    }
};
