module.exports = {
    name: 'error',
    once: false,
    async execute(error, client, config) {
        console.error('❌ Discord Error:', error);
    },
};
