const SetupService = require('../services/setup');
const authentication = require('../middleware/authentication');
const logging = require('../middleware/logging');
const cookieParser = require('cookie-parser');
const { TalkError, ErrHTTPNotFound } = require('../errors');
const express = require('express');
const i18n = require('../middleware/i18n');
const path = require('path');
const compression = require('compression');
const plugins = require('../services/plugins');
const staticTemplate = require('../middleware/staticTemplate');
const nonce = require('../middleware/nonce');
const staticFiles = require('../middleware/staticFiles');
const { DISABLE_STATIC_SERVER } = require('../config');
const { passport } = require('../services/passport');
const { MOUNT_PATH } = require('../url');
const url = require('url');
const context = require('../middleware/context');

const router = express.Router();

//==============================================================================
// STATIC FILES
//==============================================================================

if (!DISABLE_STATIC_SERVER) {
  /**
   * Serve the directories under public.
   */
  const public = path.resolve(path.join(__dirname, '../public'));
  router.use('/public', express.static(public));

  /**
   * Redirect old embed calls.
   *
   * TODO: (wyattjoh) remove this on the next minor release
   */
  const oldEmbed = url.resolve(MOUNT_PATH, 'embed.js');
  const newEmbed = url.resolve(MOUNT_PATH, 'static/embed.js');
  router.get('/embed.js', (req, res) => {
    console.warn(
      `deprecation warning: ${oldEmbed} will be phased out soon, please replace calls from ${oldEmbed} to ${newEmbed}`
    );
    res.redirect(301, newEmbed);
  });

  /**
   * Setup static file serving.
   */
  router.use('/static', staticFiles);
}

//==============================================================================
// Shared Middleware
//==============================================================================

// Add the i18n middleware to all routes.
router.use(i18n);

// Compress all API responses if appropriate.
router.use(compression());

//==============================================================================
// STATIC ROUTES
//==============================================================================

// TODO: re-add CSP once we've resolved issues with dynamic webpack loading.
const staticMiddleware = [staticTemplate, nonce];

router.use('/admin', ...staticMiddleware, require('./admin'));
router.use('/account', ...staticMiddleware, require('./account'));
router.use('/login', ...staticMiddleware, require('./login'));
router.use('/embed', ...staticMiddleware, require('./embed'));

//==============================================================================
// PASSPORT MIDDLEWARE
//==============================================================================

// Parse the cookies on the request.
router.use(cookieParser());

// Parse the body json if it's there.
router.use(express.json());

const passportDebug = require('debug')('talk:passport');

// Install the passport plugins.
plugins.get('server', 'passport').forEach(plugin => {
  passportDebug(`added plugin '${plugin.plugin.name}'`);

  // Pass the passport.js instance to the plugin to allow it to inject it's
  // functionality.
  plugin.passport(passport);
});

// Setup the PassportJS Middleware.
router.use(passport.initialize());

// Setup the Graph Context on the router.
router.use(authentication, context);

// Attach the authentication middleware, this will be responsible for decoding
// (if present) the JWT on the request.
router.use('/api', require('./api'));

//==============================================================================
// DEVELOPMENT ROUTES
//==============================================================================

if (process.env.NODE_ENV !== 'production') {
  // In development, mount the /dev routes, as well as redirect the root url to
  // the development route.
  router.use('/dev', require('./dev'));
  router.get('/', (req, res) => {
    res.redirect(url.resolve(MOUNT_PATH, 'dev'), 302);
  });
} else {
  // In production, optionally redirect to the install if not ran, or the admin.
  router.get('/', async (req, res, next) => {
    try {
      await SetupService.isAvailable();
      return res.redirect(url.resolve(MOUNT_PATH, 'admin/install'));
    } catch (e) {
      return res.redirect(url.resolve(MOUNT_PATH, 'admin'));
    }
  });
}

// Mount the plugin routes.
router.use(require('./plugins'));

//==============================================================================
// ERROR HANDLING
//==============================================================================

// Catch 404 and forward to error handler.
router.use((req, res, next) => {
  next(new ErrHTTPNotFound());
});

// Add logging for errors.
router.use(logging.error);

// General API error handler. Respond with the message and error if we have it
// while returning a status code that makes sense.
router.use('/api', (err, req, res, next) => {
  if (err instanceof TalkError) {
    res.status(err.status).json({
      message: res.locals.t(`error.${err.translation_key}`),
      error: err,
    });
  } else {
    res.status(500).json({});
  }
});

router.use('/', (err, req, res, next) => {
  if (err instanceof TalkError) {
    res.status(err.status);
    res.render('error', {
      message: res.locals.t(`error.${err.translation_key}`),
      error: process.env.NODE_ENV === 'development' ? err : {},
    });
  } else {
    res.render('error', {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : {},
    });
  }
});

module.exports = router;
