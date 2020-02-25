const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express'); //Get express module
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers')

//Connect to MongoDB
mongoose.connect('mongodb://localhost/vidly')
.then(() => console.log('Connected to MongoDB'))
.catch(() => console.error('Could not connect to MongoDB'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

//Set the root page
app.get('/', (req, res) => {
    res.send('Welcome to the Project Vidly root!');
});

//Set port as 5000
const port = 5000;

//Listen to the set port
app.listen(port, () => console.log(`Listening on port ${port}`));