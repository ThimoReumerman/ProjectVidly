const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express'); //Get express module
const router = express.Router();

//Create model
const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

//List the currently existing genres on /api/genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

//Create new genre with POST request
router.post('/', async (req, res) => {
    //Check for validation error, if so return 400
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Create new database object
    let genre = new Genre ({ name: req.body.name });
    genre = await genre.save();

    //Show added genre to user
    res.send(genre);
});

//Update genre with PUT request
router.put('/:id', async (req, res) => {

    //Validate the name
    const { error } = validateGenre(req.body);
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
router.delete('/:id', async (req, res) => {
    //Get genre to remove
    const genre = await Genre.findByIdAndRemove(req.params.id);

    //Find the genre, if non-existant, return 404
    if (!genre) return res.status(404).send('The genre with the given ID does not exist.');

    //Show deleted genre to user
    res.send(genre);
});

router.get('/:id', async (req, res) => {
    //Get the genre
    const genre = await Genre.findById(req.params.id);

    //Find the genre, if non-existant, return 404
    if (!genre) return res.status(404).send('The genre with the given ID does not exist.');

    //Show the genre
    res.send(genre);
});

//Validate the genre
function validateGenre (genre) {

    //Set validation properties
    const schema = {
        name: Joi.string().min(3).max(20).required()
    };

    //Return validation
    return Joi.validate(genre, schema);
}

module.exports = router;