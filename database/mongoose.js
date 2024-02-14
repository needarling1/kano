const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    init: () => {
        const db_options = {
            autoIndex: false,
            maxPoolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };

        mongoose.connect(`mongodb+srv://kanobot:${process.env.PWD}@kanocluster.abokltc.mongodb.net/?retryWrites=true&w=majority`, db_options)
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('kano has been connected to the database')
        })

        mongoose.connection.on('disconnected', () => {
            console.log('kano has been disconnected to the database')
        })

        mongoose.connection.on('err', () => {
            console.log('there was an error with the conection' + err)
        })
    }
}