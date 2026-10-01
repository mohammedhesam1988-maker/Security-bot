const { logMessage } = require('../handlers/logger');

module.exports = {
    name: 'messageUpdate',
    once: false,
    async execute(oldMessage, newMessage, client, config) {
        if (!newMessage.guild) return;
        if (newMessage.author?.bot) return;
        if (oldMessage.content === newMessage.content) return;

        // ==================== LOG ====================
        try {
            await logMessage(newMessage, 'update');
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
