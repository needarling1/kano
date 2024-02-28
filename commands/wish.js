const Balance = require(`../database/schema/balance_schema.js`);
const Collection = require(`../database/schema/collection_schema.js`)
const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: {
        name: 'wish',
        description: 'rolls for a character from database'
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
         }).save();
         message.channel.send(`<@${mentioned_member}>, you must have 250 prima to roll.`);
            /*await balance_profile.save().catch(err => console.error(err));*/
        }
        else {
            if (balance_profile.balance < 250) {
                message.channel.send(`<@${mentioned_member}>, you must have 250 prima to roll.`);
            }
            else {
                let collection_profile = await Collection.findOne({user_id: mentioned_member, guild_id: message.guild.id});
                
                if(!collection_profile) {
                    collection_profile = await new Collection({
                        _id: new mongoose.Types.ObjectId(),
                        user_id: mentioned_member,
                        guild_id: message.guild.id,
                        owned: [-1]
                 }).save()}

                function roll(start, end, excluded) {
                    const valid = [];
                    for (let i = start; i <= end; i++) {
                      if (!excluded.includes(i)) {
                        valid.push(i);
                      }
                    }
                    return valid[Math.floor(Math.random() * valid.length)];
                  }
                
                const raw_data = fs.readFileSync('directory.json');
                const json_data = JSON.parse(raw_data);
                
                function find_char(id) {
                    for (let i = 0; i < json_data.length; i++) {
                        if (json_data[i].Id === id) {
                            return json_data[i];
                        }
                    }
                    return null;
                }

                character_id = roll(0, 1002, collection_profile.owned)

                collection_profile.owned.push(character_id)

                await Collection.findOneAndUpdate(
                    {user_id: message.author.id, guild_id: message.guild.id}, 
                    {$set: {owned: collection_profile.owned}},
                    {new: true}
                    );

                await Balance.findOneAndUpdate(
                    {user_id: message.author.id, guild_id: message.guild.id}, 
                    {$set: {balance: balance_profile.balance - 250, timestamp: curr_time}},
                    {new: true}
                    );

                character = find_char(character_id)

                const embed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle(character.Name)
                    .setDescription(character.Media)
                    .setImage(character.Image)

                message.reply({
                    embeds: [embed]
                })
                
            }
        }
    },
};