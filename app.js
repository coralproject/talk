const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const passport = require('./services/passport');
const session = require('express-session');
const enabled = require('debug').enabled;
const RedisStore = require('connect-redis')(session);
const redis = require('./services/redis');
const csrf = require('csurf');
const errors = require('./errors');

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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//==============================================================================
// SESSION MIDDLEWARE
//==============================================================================

const session_opts = {
  secret: process.env.TALK_SESSION_SECRET,
  httpOnly: true,
  rolling: true,
  saveUninitialized: false,
  resave: false,
  unset: 'destroy',
  name: 'talk.sid',
  cookie: {
    secure: false,
    maxAge: 18000000, // 30 minutes for expiry.
  },
  store: new RedisStore({
    ttl: 1800,
    client: redis.createClient(),
  })
};

if (app.get('env') === 'production') {

  // Enable the secure cookie when we are in production mode.
  session_opts.cookie.secure = true;
} else if (app.get('env') === 'test') {

  // Add in the secret during tests.
  session_opts.secret = 'keyboard cat';
}

app.use(session(session_opts));

//==============================================================================
// PASSPORT MIDDLEWARE
//==============================================================================

// Setup the PassportJS Middleware.
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/graph', require('./routes/api/graph'));

//==============================================================================
// CSRF MIDDLEWARE
//==============================================================================

if (process.env.TEST_MODE === 'unit') {

  // Add this fake test token in the event we are in unit test mode, and don't
  // include the CSRF protection.
  app.locals.csrfToken = 'UNIT_TESTS';

} else {

  // Setup route middlewares for CSRF protection.
  // Default ignore methods are GET, HEAD, OPTIONS
  app.use(csrf({}));
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();

    next();
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
