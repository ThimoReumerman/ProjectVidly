const Joi = require('joi');
const mongoose = require('mongoose');

//Create model
const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

//Validate the genre
function validateGenre (genre) {

    //Set validation properties
    const schema = {
        name: Joi.string().min(3).max(20).required()
    };

    //Return validation
    return Joi.validate(genre, schema);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
