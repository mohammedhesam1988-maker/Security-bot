const { ReactionRole } = require('../models');

module.exports = {
    name: 'messageReactionAdd',
    once: false,
    async execute(reaction, user, client, config) {
        if (user.bot) return;
        if (reaction.partial) await reaction.fetch().catch(() => {});
        const rr = await ReactionRole.findOne({ messageId: reaction.message.id }).catch(() => null);
        if (!rr) return;
        if (reaction.emoji.name === rr.emoji) {
            const member = await reaction.message.guild.members.fetch(user.id);
            await member.roles.add(rr.roleId).catch(() => {});
        }
    },
};
