const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const {Genre} = require('../models/genre');
const {Movie, validate} = require('../models/movie');
const express = require('express'); //Get express module
const router = express.Router();

//List the currently existing movies on /api/movies
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

//Create new movie with POST request
router.post('/', auth, async (req, res) => {

    //Check for validation error, if so return 400
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Get genre
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send(error.details[0].message);

    //Create new database object
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre.id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    //Save movie to database
    await movie.save();

    //Show added movie to user
    res.send(movie);
});

//Update movie with PUT request
router.put('/:id', auth, async (req, res) => {

    //Validate the request
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Get genre
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send(error.details[0].message);

    //Update movie
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre.id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, {new: true});

    //Find the movie, if non-existant return 404
    if (!movie) return res.status(404).send('Movie was not found.');

    //Show updated movie to user
    res.send(movie);
});

//Delete movie with DELETE request
router.delete('/:id', auth, async (req, res) => {
    
    //Get the movie to delete
    const movie = await Movie.findByIdAndRemove(req.params.id);

    //Find the movie, if non-existant, return 404
    if (!movie) return res.status(404).send('The movie with the given ID does not exist.');

    //Show the deleted movie to the user
    res.send(movie);
});

//Show movie with GET request
router.get('/:id', async (req, res) => {

    //Get the movie
    const movie = await Movie.findById(req.params.id);

    //Find the movie, if non-existant, return 404
    if (!movie) return res.status(404).send('The movie with the given ID does not exist.');

    //Show the movie
    res.send(movie);
});

module.exports = router;