const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
    //Connect to MongoDB
    mongoose.connect('mongodb://localhost/vidly')
        .then(() => winston.info('Connected to MongoDB'));
}