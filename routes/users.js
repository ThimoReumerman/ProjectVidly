const mongoose = require('mongoose');
const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();

//Create a new user with POST request
router.post('/', async (req, res) => {

    //Check for validation error, if so return 400
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Create a new database object
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    //Save new user to database
    await user.save();

    //Show saved user to user
    res.send(user);

});

module.exports = router;