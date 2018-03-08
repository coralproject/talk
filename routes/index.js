const SetupService = require('../services/setup');
const authentication = require('../middleware/authentication');
const cookieParser = require('cookie-parser');
const enabled = require('debug').enabled;
const errors = require('../errors');
const express = require('express');
const i18n = require('../middleware/i18n');
const path = require('path');
const compression = require('compression');
const plugins = require('../services/plugins');
const staticTemplate = require('../middleware/staticTemplate');
const staticMiddleware = require('express-static-gzip');
const { DISABLE_STATIC_SERVER } = require('../config');
const { passport } = require('../services/passport');
const { MOUNT_PATH } = require('../url');
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
   */
  const oldEmbed = path.resolve(MOUNT_PATH, 'embed.js');
  const newEmbed = path.resolve(MOUNT_PATH, 'static/embed.js');
  router.get('/embed.js', (req, res) => {
    console.warn(
      `deprecation warning: ${oldEmbed} will be phased out soon, please replace calls from ${oldEmbed} to ${newEmbed}`
    );
    res.redirect(301, newEmbed);
  });

  /**
   * Serve the directories under dist.
   */
  const dist = path.resolve(path.join(__dirname, '../dist'));
  if (process.env.NODE_ENV === 'production') {
    router.use(
      '/static',
      staticMiddleware(dist, {
        indexFromEmptyFile: false,
        enableBrotli: true,
        customCompressions: [
          {
            encodingName: 'deflate',
            fileExtension: 'zz',
          },
        ],
      })
    );
  } else {
    router.use('/static', express.static(dist));
  }
}

// Add the i18n middleware to all routes.
router.use(i18n);

// Compress all API responses if appropriate.
router.use(compression());

//==============================================================================
// STATIC ROUTES
//==============================================================================

router.use('/admin', staticTemplate, require('./admin'));
router.use('/login', staticTemplate, require('./login'));
router.use('/embed', staticTemplate, require('./embed'));

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
  router.use('/assets', staticTemplate, require('./assets'));
  router.get('/', staticTemplate, async (req, res) => {
    try {
      await SetupService.isAvailable();
      return res.redirect('/admin/install');
    } catch (e) {
      return res.render('article', {
        title: 'Coral Talk',
        asset_url: '',
        asset_id: '',
        body: '',
        basePath: '/static/embed/stream',
      });
    }
  });
} else {
  router.get('/', async (req, res, next) => {
    try {
      await SetupService.isAvailable();
      return res.redirect('/admin/install');
    } catch (e) {
      return res.redirect('/admin');
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
  next(errors.ErrNotFound);
});

// General API error handler. Respond with the message and error if we have it
// while returning a status code that makes sense.
router.use('/api', (err, req, res, next) => {
  if (err !== errors.ErrNotFound) {
    if (process.env.NODE_ENV !== 'test' || enabled('talk:errors')) {
      console.error(err);
    }
  }

  if (err instanceof errors.APIError) {
    res.status(err.status).json({
      message: res.locals.t(`error.${err.translation_key}`),
      error: err,
    });
  } else {
    res.status(500).json({});
  }
});

router.use('/', (err, req, res, next) => {
  if (err !== errors.ErrNotFound) {
    console.error(err);
  }

  if (err instanceof errors.APIError) {
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
