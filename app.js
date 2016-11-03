/* This is the entrypoint for the Talk Platform server. */

// Initialize application framework.
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/v1', require('./routes/api'));

module.exports = app;
