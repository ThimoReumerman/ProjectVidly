const mongoose = require('mongoose');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const {Rental, validate} = require('../models/rental');
const express = require('express');
const router = express.Router();

//List all currently existing rentals on /api/rentals
router.get('/', async (req, res) => {

    //Get all rentals
    const rentals = await Rental.find().sort('-dateOut');

    //Show rentals to user
    res.send(rentals);
});

//Create a new rental
router.post('/', async (req, res) => {

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
    let rental = new Rental({
        customer: customer,
        movie: movie
    });

    //Save rental to database
    rental = await rental.save();

    //Remove one movie from stock
    movie.numberInStock--;
    movie.save();

    //Show added rental to user
    res.send(rental);
});

module.exports = router;