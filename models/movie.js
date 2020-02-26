const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');

//Create schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        default: 0,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 255
    }
});

//Create model
const Movie = mongoose.model('Movie', movieSchema);

//Validate the movie
function validateMovie(movie) {

    //Set validation properties
    const schema = {
        title: Joi.string().min(3).max(50).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().default(0),
        dailyRentalRate: Joi.number().default(0)
    };

    //Return validation
    return Joi.validate(movie, schema);
}

module.exports.movieSchema = movieSchema;
module.exports.Movie = Movie;
module.exports.validate = validateMovie;