const Collection = require(`../database/schema/collection_schema.js`)
const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: {
        name: 'collection',
        description: 'returns the collection of characters'
    },
    async execute(message, args, client){
        let mentioned_member = message.author.id;
        
        let collection_profile = await Collection.findOne({user_id: mentioned_member, guild_id: message.guild.id});
                
        if(!collection_profile) {
            collection_profile = await new Collection({
                _id: new mongoose.Types.ObjectId(),
                user_id: mentioned_member,
                guild_id: message.guild.id,
                owned: [-1]
            }).save()
            message.channel.send(`<@${mentioned_member}>, you currently don't have any characters`);
        }
        else {
                
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

            collection_profile.owned.sort(function(a, b) {
                return a - b;
              });

            await Collection.findOneAndUpdate(
                {user_id: message.author.id, guild_id: message.guild.id}, 
                {$set: {owned: collection_profile.owned}},
                {new: true}
                );

            char_arr = collection_profile.owned;
            
            character = find_char(char_arr[1]);
            description = "1. " + character.Name;

            for (let i = 2; i < char_arr.length; i++){
                current = find_char(char_arr[i])
                description = description.concat("\n", i + ". " + current.Name)
            }

            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle(message.author.username + "'s collection")
                .setThumbnail(character.Image)
                .setDescription(description)

            message.reply({
                embeds: [embed]
            })
        }
                
    }
}
