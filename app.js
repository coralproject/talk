/* This is the entrypoint for the Talk Platform server. */

// Initialize application framework.
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use('/api/v1', require('./routes/api'));
app.use('/client/', express.static('./dist'));

module.exports = app;
