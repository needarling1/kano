const { Events } = require('discord.js');

module.exports = {
	name: 'message',
	async execute(message,client) {
        if(message.author.bot) return;
        if(message.channel.type == 'dm') return;
	},
};