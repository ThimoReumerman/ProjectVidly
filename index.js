const winston = require('winston');
const express = require('express'); //Get express module
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = 5000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}`));

module.exports = server;