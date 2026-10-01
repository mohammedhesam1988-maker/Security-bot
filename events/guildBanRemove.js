const { logUnban } = require('../handlers/logger');

module.exports = {
    name: 'guildBanRemove',
    once: false,
    async execute(ban, client, config) {
        if (!ban.guild) return;
        try {
            await logUnban(ban);
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
