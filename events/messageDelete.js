const { logMessage } = require('../handlers/logger');

module.exports = {
    name: 'messageDelete',
    once: false,
    async execute(message, client, config) {
        if (!message.guild) return;
        if (message.author?.bot) return;

        // ==================== LOG ====================
        try {
            await logMessage(message, 'delete');
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
