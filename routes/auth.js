const lodash = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

//Create a new user with POST request
router.post('/', async (req, res) => {

    //Check for validation error, if so return 400
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if user is in database
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password.');

    //Check for password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token); //Send true to the client

});

function validate(req) {

        //Create validation schema
        const schema = {
            email: Joi.string().min(5).max(255).required(),
            password: Joi.string().min(5).max(255).required()
        }
    
        //Return validation
        return Joi.validate(req, schema);
}
module.exports = router;