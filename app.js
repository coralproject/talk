const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const {ROOT_URL, ROOT_URL_MOUNT_PATH} = require('./config');
const routes = require('./routes');
const debug = require('debug')('talk:app');
const {URL} = require('url');

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

// Set the BASE_URL as the ROOT_URL, here we derive the root url by ensuring
// that it ends in a `/`.
const BASE_URL = ROOT_URL && ROOT_URL.length > 0 && ROOT_URL[ROOT_URL.length - 1] === '/' ? ROOT_URL : `${ROOT_URL}/`;

// The BASE_PATH is simply the path component of the BASE_URL.
const BASE_PATH = new URL(BASE_URL).pathname;

// The MOUNT_PATH is derived from the BASE_PATH, if it is provided and enabled.
// This will mount all the application routes onto it.
const MOUNT_PATH = ROOT_URL_MOUNT_PATH ? BASE_PATH : '/';

// Apply the BASE_PATH, BASE_URL, and MOUNT_PATH on the app.locals, which will
// make them available on the templates and the routers.
app.locals.BASE_URL = BASE_URL;
app.locals.BASE_PATH = BASE_PATH;
app.locals.MOUNT_PATH = MOUNT_PATH;

debug(`mounting routes on the ${MOUNT_PATH} path`);

// Actually apply the routes.
app.use(MOUNT_PATH, routes);

module.exports = app;
