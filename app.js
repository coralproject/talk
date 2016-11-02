/* This is the entrypoint for the Talk Platform server. */

// Initialize application framework.
const express = require('express');

const app = express();

app.use('/api/v1', require('./routes/api'));

module.exports = app;
