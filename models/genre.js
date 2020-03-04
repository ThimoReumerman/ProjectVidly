const Joi = require('joi');
const mongoose = require('mongoose');

//Create schema
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

//Create model
const Genre = mongoose.model('Genre', genreSchema);

//Validate the genre
function validateGenre (genre) {

    //Set validation properties
    const schema = {
        name: Joi.string().min(5).max(50).required()
    };

    //Return validation
    return Joi.validate(genre, schema);
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenre;
