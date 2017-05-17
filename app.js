const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const authentication = require('./middleware/authentication');
const {passport} = require('./services/passport');
const plugins = require('./services/plugins');
const enabled = require('debug').enabled;
const errors = require('./errors');
const {createGraphOptions} = require('./graph');
const apollo = require('graphql-server-express');

const app = express();

// Middleware declarations.

// Add the logging middleware only if we aren't testing.
if (app.get('env') !== 'test') {
  app.use(morgan('dev'));
}

//==============================================================================
// APP MIDDLEWARE
//==============================================================================

app.set('trust proxy', 1);

// We disable frameward on helmet to allow crossdomain injection of the embed
app.use(helmet({
  frameguard: false
}));
app.use(bodyParser.json());
app.use('/client', express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//==============================================================================
// PASSPORT MIDDLEWARE
//==============================================================================

const passportDebug = require('debug')('talk:passport');

// Install the passport plugins.
plugins.get('server', 'passport').forEach((plugin) => {
  passportDebug(`added plugin '${plugin.plugin.name}'`);

  // Pass the passport.js instance to the plugin to allow it to inject it's
  // functionality.
  plugin.passport(passport);
});

// Setup the PassportJS Middleware.
app.use(passport.initialize());

// Attach the authentication middleware, this will be responsible for decoding
// (if present) the JWT on the request.
app.use('/api', authentication);

//==============================================================================
// GraphQL Router
//==============================================================================

// GraphQL endpoint.
app.use('/api/v1/graph/ql', apollo.graphqlExpress(createGraphOptions));

// Only include the graphiql tool if we aren't in production mode.
if (app.get('env') !== 'production') {

  // Interactive graphiql interface.
  app.use('/api/v1/graph/iql', (req, res) => {
    res.render('graphiql', {
      endpointURL: '/api/v1/graph/ql'
    });
  });

  // GraphQL documention.
  app.get('/admin/docs', (req, res) => {
    res.render('admin/docs');
  });

}

//==============================================================================
// ROUTES
//==============================================================================

app.use('/', require('./routes'));

//==============================================================================
// ERROR HANDLING
//==============================================================================

// Catch 404 and forward to error handler.
app.use((req, res, next) => {
  next(errors.ErrNotFound);
});

// General error handler. Respond with the message and error if we have it while
// returning a status code that makes sense.
app.use('/api', (err, req, res, next) => {
  if (err !== errors.ErrNotFound) {
    if (app.get('env') !== 'test' || enabled('talk:errors')) {
      console.error(err);
    }
  }

  if (err instanceof errors.APIError) {
    res.status(err.status).json({
      message: err.message,
      error: err
    });
  } else {
    res.status(500).json({});
  }
});

app.use('/', (err, req, res, next) => {
  if (err !== errors.ErrNotFound) {
    console.error(err);
  }

  if (err instanceof errors.APIError) {
    res.status(err.status);
    res.render('error', {
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
    });
  } else {
    res.render('error', {
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
    });
  }
});

module.exports = app;
