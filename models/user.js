const Joi = require('joi');
const mongoose = require('mongoose');

//Create schema
const userSchema = new mongoose.Schema({
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
    }
});

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