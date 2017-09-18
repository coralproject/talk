const express = require('express');
const path = require('path');
const plugins = require('../services/plugins');
const debug = require('debug')('talk:routes');
const authentication = require('../middleware/authentication');
const {passport} = require('../services/passport');
const pubsub = require('../middleware/pubsub');
const i18n = require('../services/i18n');
const enabled = require('debug').enabled;
const errors = require('../errors');
const {createGraphOptions} = require('../graph');
const accepts = require('accepts');
const apollo = require('graphql-server-express');
const {DISABLE_STATIC_SERVER} = require('../config');

const router = express.Router();

//==============================================================================
// STATIC FILES
//==============================================================================

// If the application is in production mode, then add gzip rewriting for the
// content.
if (process.env.NODE_ENV === 'production') {
  router.get('*.js', (req, res, next) => {
    const accept = accepts(req);
    if (accept.encoding(['gzip']) === 'gzip') {

      // Adjsut the headers on the request by adding a content type header
      // because express won't be able to detect the mime-type with the .gz
      // extension and we need to decalre support for the gzip encoding.
      res.set('Content-Type', 'application/javascript');
      res.set('Content-Encoding', 'gzip');

      // Rewrite the url so that the gzip version will be served instead.
      req.url = `${req.url}.gz`;
    }

    next();
  });
}

if (!DISABLE_STATIC_SERVER) {

  /**
   * Serve the directories under public/dist from this router.
   */
  router.use('/client', express.static(path.join(__dirname, '../dist')));
  router.use('/public', express.static(path.join(__dirname, '../public')));

  /**
   * Serves a file based on a relative path.
   */
  const serveFile = (filename) => (req, res) => res.sendFile(path.join(__dirname, filename));

  /**
   * Serves the embed javascript files.
   */
  router.get('/embed.js', serveFile('../dist/embed.js'));
  router.get('/embed.js.gz', serveFile('../dist/embed.js.gz'));
  router.get('/embed.js.map', serveFile('../dist/embed.js.map'));
}

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
  router.use('/api/v1/graph/iql', (req, res) => {
    res.render('graphiql', {
      endpointURL: `${req.app.locals.BASE_URL}api/v1/graph/ql`
    });
  });

  // GraphQL documention.
  router.get('/admin/docs', (req, res) => {
    res.render('admin/docs');
  });

}

//==============================================================================
// ROUTES
//==============================================================================

router.use('/api/v1', require('./api'));
router.use('/admin', require('./admin'));
router.use('/embed', require('./embed'));

if (process.env.NODE_ENV !== 'production') {
  router.use('/assets', require('./assets'));

  router.get('/', (req, res) => {
    return res.render('article', {
      title: 'Coral Talk',
      asset_url: '',
      asset_id: '',
      body: '',
      basePath: '/client/embed/stream'
    });
  });
}

// Inject server route plugins.
plugins.get('server', 'router').forEach((plugin) => {
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
      message: err.message,
      error: err
    });
  } else {
    res.status(500).json({});
  }
});

router.use('/', (err, req, res, next) => {
  if (err !== errors.ErrNotFound) {
    console.error(err);
  }

  i18n.init(req);

  if (err instanceof errors.APIError) {
    res.status(err.status);
    res.render('error', {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  } else {
    res.render('error', {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

module.exports = router;
