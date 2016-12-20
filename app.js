const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const passport = require('./services/passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('./services/redis');
const cookieParser = require('cookie-parser');

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
// CSRF MIDDLEWARE
//==============================================================================

// Use CSRF only if we are not testing.
if (app.get('env') !== 'test') {
  console.log('DEBUGT NO TEST');
  app.use(cookieParser());
}

app.use((err, req, res, next) => {
  console.log('DEBUG EN SERVER', req.csrfToken());

  res.locals._csrf = req.csrfToken();
  return next();
});

//==============================================================================
// PASSPORT MIDDLEWARE
//==============================================================================

// Setup the PassportJS Middleware.
app.use(passport.initialize());
app.use(passport.session());

//==============================================================================
// ROUTES
//==============================================================================

app.use('/', require('./routes'));

//==============================================================================
// ERROR HANDLING
//==============================================================================

const ErrNotFound = new Error('Not Found');
ErrNotFound.status = 404;

// Catch 404 and forward to error handler.
app.use((req, res, next) => {
  next(ErrNotFound);
});

// General error handler. Respond with the message and error if we have it while
// returning a status code that makes sense.
app.use('/api', (err, req, res, next) => {
  if (err !== ErrNotFound) {
    if (app.get('env') !== 'test') {
      console.error(err);
    }
  }

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

app.use('/', (err, req, res, next) => {
  if (err !== ErrNotFound) {
    console.error(err);
  }

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
