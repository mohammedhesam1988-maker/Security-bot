module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client, config) {
        console.log(`✅ ${client.user.tag} is online!`);
    },
};
