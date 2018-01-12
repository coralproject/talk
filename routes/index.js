const SetupService = require('../services/setup');
const apollo = require('apollo-server-express');
const authentication = require('../middleware/authentication');
const cookieParser = require('cookie-parser');
const debug = require('debug')('talk:routes');
const enabled = require('debug').enabled;
const errors = require('../errors');
const express = require('express');
const i18n = require('../middleware/i18n');
const path = require('path');
const plugins = require('../services/plugins');
const staticTemplate = require('../middleware/staticTemplate');
const pubsub = require('../middleware/pubsub');
const staticMiddleware = require('express-static-gzip');
const { DISABLE_STATIC_SERVER } = require('../config');
const { createGraphOptions } = require('../graph');
const { passport } = require('../services/passport');
const { MOUNT_PATH } = require('../url');

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
  router.get('/embed.js', (req, res) => {
    const oldEmbed = path.resolve(MOUNT_PATH, 'embed.js');
    const newEmbed = path.resolve(MOUNT_PATH, 'static/embed.js');

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

//==============================================================================
// STATIC ROUTES
//==============================================================================

router.use('/admin', staticTemplate, require('./admin'));
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

// Attach the authentication middleware, this will be responsible for decoding
// (if present) the JWT on the request.
router.use('/api', authentication, pubsub);

//==============================================================================
// GraphQL Router
//==============================================================================

// GraphQL endpoint.
router.use('/api/v1/graph/ql', apollo.graphqlExpress(createGraphOptions));

// Only include the graphiql tool if we aren't in production mode.
if (process.env.NODE_ENV !== 'production') {
  // Interactive graphiql interface.
  router.use('/api/v1/graph/iql', staticTemplate, (req, res) => {
    res.render('graphiql', {
      endpointURL: 'api/v1/graph/ql',
    });
  });

  // GraphQL documentation.
  router.get('/admin/docs', (req, res) => {
    res.render('admin/docs');
  });
}

router.use('/api/v1', require('./api'));

//==============================================================================
// ROUTES
//==============================================================================

// Development routes.
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

// Inject server route plugins.
plugins.get('server', 'router').forEach(plugin => {
  debug(`added plugin '${plugin.plugin.name}'`);

  // Pass the root router to the plugin to mount it's routes.
  plugin.router(router);
});

//==============================================================================
// ERROR HANDLING
//==============================================================================

// Catch 404 and forward to error handler.
router.use((req, res, next) => {
  next(errors.ErrNotFound);
});

// General api error handler. Respond with the message and error if we have it
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
