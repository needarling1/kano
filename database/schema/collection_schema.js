const mongoose = require('mongoose');

const collection_schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: String,
    guild_id: String,
    owned: {type: Array, default: [-1]},
})

module.exports = new mongoose.model(`Collection`, collection_schema, 'collections')