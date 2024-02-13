require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js')
const fs = require('fs');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const voltFile = 'currency.json';

let voltData = {};

if(fs.existsSync(voltFile)){
    voltData = JSON>parse(fs.readFileSync(voltFile));
}

client.on('ready', (c) => {
    console.log(`${c.user.username}`, 'is online.')
});

client.on('messageCreate', (msg) => {
    console.log(msg.content);


});
client.on('message', (message) => {
    console.log(message.content);
    if (message.author.bot || !message.guild) return;

    
    
    addVolt(message.author.id, 1);

    saveVoltData();

    if (message.content === '!balance') {
        const balance = getBalance(message.author.id);
        message.channel.send('Your balance: $', {balance}, 'coin');
    }
});

function addVolt(userId, amount) {
    if(!voltData[userId]){

        volt[userId] = 0;

    }
    voltData[userId] += amount;
}

function getBalance(userId) {
    return voltData[userId] || 0;
}

function saveVoltData() {
    fs.writeFileSync(voltFile, JSON.stringify(voltData, null, 4), 'utf8')
}

console.log(process.env.TOKEN);
client.login("MTE5OTEwMjA2MjkxNTQ5ODEzNA.GQNJLk.zDPp0lZ44wq_fAnQMCfe5pvnVNSDdv5wtPdDOA");