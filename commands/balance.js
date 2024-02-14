const Balance = require('../database/schema/balance_schema');
const mongoose = require('mongoose');

module.exports = {
    name: 'balance',
    async execute(message, args, client){
        let mentioned_member = message.mentions.members.find() || await message.guild.members.fetch(args[0]);
        let balance_profile = await Balance.findOne({user_id: mentioned_member.id});

        if(!balance_profile) 
        {
            balance_profile = await new Balance({
                _id: mongoose.Types.ObjectID(),
                user_id: mentioned_memeber.id,
                timestamp: 0
         });
            await balance_profile.save().catch(err);
        }

        message.channel.send(`${mentioned_member} has ${balance_profile.balance}.`);
    },
};