const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const {Genre, validate} = require('../models/genre');
const express = require('express'); //Get express module
const router = express.Router();


//List the currently existing genres on /api/genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);

});

//Create new genre with POST request
router.post('/', auth, async (req, res) => {

    //Check for validation error, if so return 400
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Create new database object
    const genre = new Genre ({ name: req.body.name });
    await genre.save();

    //Show added genre to user
    res.send(genre);
});

//Update genre with PUT request
router.put('/:id', auth, async (req, res) => {

    //Validate the name
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Update genre
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    });

    //Find the genre, if non-existant, return 404
    if (!genre) return res.status(404).send('The genre with the given ID does not exist.');

    //Show updated genre to user
    res.send(genre);
});

//Delete genre with DELETE request
router.delete('/:id', [auth, admin], async (req, res) => {
    //Get genre to remove
    const genre = await Genre.findByIdAndRemove(req.params.id);

    //Find the genre, if non-existant, return 404
    if (!genre) return res.status(404).send('The genre with the given ID does not exist.');

    //Show deleted genre to user
    res.send(genre);
});

//Show the genre
router.get('/:id', async (req, res) => {
    //Get the genre
    const genre = await Genre.findById(req.params.id);

    //Find the genre, if non-existant, return 404
    if (!genre) return res.status(404).send('The genre with the given ID does not exist.');

    //Show the genre
    res.send(genre);
});

module.exports = router;