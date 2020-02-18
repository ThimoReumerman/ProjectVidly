const Joi = require('joi');
const express = require('express'); //Get express module
const app = express();


app.use(express.json());

//Create genres array
const genres = [
    {id: 1, name:"Action"}
];

//Set the root page
app.get('/', (req, res) => {
    res.send('Welcome to the Project Vidly root!');
});

//List the currently existing genres on /api/genres
app.get('/api/genres', (req, res) => {
    res.send([genres]);
});

//Create new genre with POST request
app.post('/api/genres', (req, res) => {
    //Check for validation error, if so return 400
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Create new genre object
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    //Add genre to array
    genres.push(genre);

    //Show added genre to user
    res.send(genre);
});

//Update genre with PUT request
app.put('/api/genres/:id', (req, res) => {
    //Find the genre, if non-existant, return 404
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID does not exist.');

    //Validate the name
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    //Update the genre
    genre.name = req.body.name;

    //Show updated genre to user
    res.send(genre);
});

//Delete genre with DELETE request
app.delete('/api/genres/:id', (req, res) => {
    //Find the genre, if non-existant, return 404
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID does not exist.');

    //Delete the genre
    const index = genres.indexOf(genre);

    //Delete 1 object in genres at index
    genres.splice(index, 1);

    //Show deleted genre to user
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

//Set port as 5000
const port = 5000;

//Listen to the set port
app.listen(port, () => console.log(`Listening on port ${port}`));