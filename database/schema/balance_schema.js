const mongoose = require('mongoose');

const balance_schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: String,
    timestamp: Number,
    balance: {type: Number, default: 0}
})

module.exports = new mongoose.model(`Balance`, balance_schema, 'balances')