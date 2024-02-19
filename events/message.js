const { Events } = require('discord.js');
const Balance = require(`../database/schema/balance_schema.js`)
const mongoose = require('mongoose');

module.exports = {
	name: Events.MessageCreate,
	async execute(message, client) {
        if(message.author.bot) return;
        if(message.channel.type == 'dm') return;
        
        /* balance control here down */
        let balance_profile = await Balance.findOne({user_id: message.author.id, guild_id: message.guild.id});
        if(!balance_profile) 
        {
            balance_profile = await new Balance({
                _id: new mongoose.Types.ObjectId(),
                user_id: message.author.id,
                guild_id: message.guild.id,
                timestamp: Date.now()
         }).save();
         console.log('executed balance profile')
            /*await balance_profile.save().catch(err);*/
        }

        curr_time = Date.now();
        console.log(curr_time - balance_profile.timestamp)

        if ((curr_time - balance_profile.timestamp) >= 60000) {
            await Balance.findOneAndUpdate(
                {user_id: message.author.id, guild_id: message.guild.id}, 
                {$set: {balance: balance_profile.balance + 1, timestamp: curr_time}},
                {new: true}
                );
        }

        console.log('executed messages')
        
	},
};