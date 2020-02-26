const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express'); //Get express module
const router = express.Router();

//List the currently existing genres on /api/genres
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

//Create new genre with POST request
router.post('/', async (req, res) => {
    //Check for validation error, if so return 400
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Create new database object
    const customer = new Customer ({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold 
    });
    
    //Save customer to database
    await customer.save();

    //Show added genre to user
    res.send(customer);
});

//Update genre with PUT request
router.put('/:id', async (req, res) => {

    //Validate the name
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Update genre
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {
        new: true
    });

    //Find the genre, if non-existant, return 404
    if (!customer) return res.status(404).send('The customer with the given ID does not exist.');

    //Show updated genre to user
    res.send(customer);
});

//Delete genre with DELETE request
router.delete('/:id', async (req, res) => {
    //Get genre to remove
    const customer = await Customer.findByIdAndRemove(req.params.id);

    //Find the genre, if non-existant, return 404
    if (!customer) return res.status(404).send('The customer with the given ID does not exist.');

    //Show deleted genre to user
    res.send(customer);
});

router.get('/:id', async (req, res) => {
    //Get the genre
    const customer = await Customer.findById(req.params.id);

    //Find the genre, if non-existant, return 404
    if (!customer) return res.status(404).send('The customer with the given ID does not exist.');

    //Show the genre
    res.send(customer);
});

module.exports = router;