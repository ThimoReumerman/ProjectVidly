const auth = require('../middleware/auth');
const lodash = require('lodash');
const bcrypt = require('bcrypt');
const {User, validation} = require('../models/user');
const express = require('express');
const validate = require('../middleware/validate');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user).select('-password');
    return res.status(200).send(user);
});

//Create a new user with POST request
router.post('/', validate(validation), async (req, res) => {

    //Check if user is in database
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered.');

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