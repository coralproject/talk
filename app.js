const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middleware declarations.
app.use(morgan('dev'));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// API Routes.
app.use('/api/v1', require('./routes/api'));

// Static Routes.
app.use('/client/', express.static(path.join(__dirname, 'dist')));

app.get('/admin/*', (req, res) => {
  res.render('admin', {basePath: '/client/coral-admin'});
});

module.exports = app;
