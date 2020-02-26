const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express'); //Get express module
const app = express();

// API Routes
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

//Set environment variable
if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}
//Connect to MongoDB
mongoose.connect('mongodb://localhost/vidly')
.then(() => console.log('Connected to MongoDB'))
.catch(() => console.error('Could not connect to MongoDB'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

//Set the root page
app.get('/', (req, res) => {
    res.send('Welcome to the Project Vidly root!');
});

//Set port as 5000
const port = 5000;

//Listen to the set port
app.listen(port, () => console.log(`Listening on port ${port}`));