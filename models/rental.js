const Joi = require('joi');
const mongoose = require('mongoose');
const {customerSchema} = require('./customer');
const {movieSchema} = require('./movie');

//Create model
const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: customerSchema,
    movie: movieSchema,
    price: {
        type: Number,
        default: 0
    },
    isRented: {
        type: Boolean,
        default: false
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

//Validate the rental
function validateRental(rental) {

    //Set validation properties
    const schema = {
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
        // price: Joi.number(),
        // isRented: Joi.boolean(),
        // dateIn: Joi.date(),
        // dateOut: Joi.date(),
        // rentalFee: Joi.number()
    }

    //Return validation of the rental
    return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;