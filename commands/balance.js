const Balance = require(`../database/schema/balance_schema.js`);
const mongoose = require('mongoose');

module.exports = {
    data: {
        name: 'balance',
        description: 'displays the balance of the user'
    },
    async execute(message, args, client){
        let mentioned_member = message.author.id;
        let balance_profile = await Balance.findOne({user_id: mentioned_member, guild_id: message.guild.id});

        if(!balance_profile) {
            balance_profile = await new Balance({
                _id: new mongoose.Types.ObjectId(),
                user_id: mentioned_member,
                guild_id: message.guild.id,
                timestamp: 0, 
                timestamp: Date.now()
         });
            /*await balance_profile.save().catch(err => console.error(err));*/
        }

        message.channel.send(`<@${mentioned_member}> has ${balance_profile.balance} prima.`);
        console.log('executed!');
    },
};