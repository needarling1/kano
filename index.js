require('dotenv').config();
const fs = require('fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('./database/mongoose')

mongoose.init();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.prefix = '!';
client.commands = new Collection();

const command_files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of command_files) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command)
}

const events_path = path.join(__dirname, 'events');
const event_files = fs.readdirSync(events_path).filter(file => file.endsWith('.js'));

for (const file of event_files) {
	const file_path = path.join(events_path, file);
	const event = require(file_path);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);


