const { Events } = require('discord.js');
const Balance = require(`../database/schema/balance_schema.js`)

module.exports = {
	name: 'message',
	async execute(message,client) {
        if(message.author.bot) return;
        if(message.channel.type == 'dm') return;
        console.log(message.content);
        /* balance control here down */
        let balance_profile = await Balance.findOne({user_id: message.author.id, timestamp: Date.now()});
        if(!balance_profile) 
        {
            balance_profile = await new Balance({
                _id: mongoose.Types.ObjectID(),
                user_id: message.author.id,
                timestamp: 0
         });
            await balance_profile.save().catch(err);
        }

        curr_time = Date.now();


        await Balance.findOneAndUpdate({user_id: message.author.id}, {balance: balance_profile.balance + 1 });
        
	},
};