const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const {
  BASE_URL,
  BASE_PATH,
  MOUNT_PATH,
  STATIC_URL,
} = require('./url');
const routes = require('./routes');
const debug = require('debug')('talk:app');

const app = express();

//==============================================================================
// APPLICATION WIDE MIDDLEWARE
//==============================================================================

// Add the logging middleware only if we aren't testing.
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Trust the first proxy in front of us, this will enable us to trust the fact
// that SSL was terminated correctly.
app.set('trust proxy', 1);

// Enable a suite of security good practices through helmet. We disable
// frameguard to allow crossdomain injection of the embed.
app.use(helmet({
  frameguard: false,
}));

// Compress the responses if appropriate.
app.use(compression());

// Parse the cookies on the request.
app.use(cookieParser());

// Parse the body json if it's there.
app.use(bodyParser.json());

//==============================================================================
// VIEW CONFIGURATION
//==============================================================================

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//==============================================================================
// ROUTES
//==============================================================================

// Apply the BASE_PATH, BASE_URL, and MOUNT_PATH on the app.locals, which will
// make them available on the templates and the routers.
app.locals.BASE_URL = BASE_URL;
app.locals.BASE_PATH = BASE_PATH;
app.locals.MOUNT_PATH = MOUNT_PATH;
app.locals.STATIC_URL = STATIC_URL;

debug(`mounting routes on the ${MOUNT_PATH} path`);

// Actually apply the routes.
app.use(MOUNT_PATH, routes);

module.exports = app;
