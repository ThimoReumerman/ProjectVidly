const jwt = require('jsonwebtoken');
const config = require('config');
const lodash = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();

//Create a new user with POST request
router.post('/', async (req, res) => {

    //Check for validation error, if so return 400
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if user is in database
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered.');

    //Create a new database object
    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    //Create new user
    user = new User(lodash.pick(req.body, ['name', 'email', 'password']));

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    //Save new user to database
    await user.save();

    //Generate token
    const token = user.generateAuthToken();

    //Set header and send response
    res.header('x-auth-token', token).send(lodash.pick(user, ['_id', 'name', 'email']));


});

module.exports = router;