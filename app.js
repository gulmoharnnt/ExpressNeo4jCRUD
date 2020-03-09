const express = require('express');
const winston = require('winston');

const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/config')();

const port = 7000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
