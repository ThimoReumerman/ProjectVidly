const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const {Rental, validate} = require('../models/rental');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

//List all currently existing rentals on /api/rentals
router.get('/', async (req, res) => {

    //Get all rentals
    const rentals = await Rental.find().sort('-dateOut');

    //Show rentals to user
    res.send(rentals);
});

//Create a new rental
router.post('/', auth, async (req, res) => {

    //Check for validation error, if so return 400
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Get customer
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send(error.details[0].message);

    //Get movie
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send(error.details[0].message);

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    //Create new database object
    const rental = new Rental({
        customer: customer,
        movie: movie
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: {numberInStock: -1} //Increment numberInStock by -1
            })
            .run();

        res.send(rental);
    } catch (ex) {
        res.status(500).send('Something failed.');
    }
});

module.exports = router;