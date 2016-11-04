/* This is the entrypoint for the Talk Platform server. */

// Initialize application framework.
const express = require('express');

const app = express();

app.use('/api/v1', require('./routes/api'));
app.use('/client/', express.static('./dist'));

module.exports = app;
