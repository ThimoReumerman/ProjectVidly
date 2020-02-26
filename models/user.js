const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

//Create schema
const userSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        minlength: 3,
        maxlength: 50
    }, 
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true
    }, 
    password: {
        type: String,
        minLength: 5,
        maxLength: 255
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    //Generate token
    // console.log(`ID is ${this.id}, name is ${this.name}, isAdmin is ${this.isAdmin}.`);
    const token = jwt.sign({_id: this._id, name: this.name, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    console.log('Signing this object: ', {_id: this._id, name: this.name, isAdmin: this.isAdmin}, ' with config ', config.get('jwtPrivateKey'));
    console.log('The token is ', token);

    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    console.log('decoded', decoded);
    
    return token;
}

//Create model
const User = mongoose.model('User', userSchema);

//Validate the user
function validateUser(user) {

    //Create validation schema
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    }

    //Return validation
    return Joi.validate(user, schema);
}

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validate = validateUser;