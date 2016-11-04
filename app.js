const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middleware declarations.
app.use(morgan('dev'));

// API Routes.
app.use('/api/v1', require('./routes/api'));

// Static Routes.
app.use('/client/', express.static(path.join(__dirname, 'dist')));

module.exports = app;
