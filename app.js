const express = require('express');
const nunjucks = require('nunjucks');
const cons = require('consolidate');
const trace = require('./middleware/trace');
const logging = require('./middleware/logging');
const path = require('path');
const merge = require('lodash/merge');
const helmet = require('helmet');
const plugins = require('./services/plugins');
const { HELMET_CONFIGURATION } = require('./config');
const { MOUNT_PATH } = require('./url');
const routes = require('./routes');
const debug = require('debug')('talk:app');
const { ENABLE_TRACING, APOLLO_ENGINE_KEY, PORT } = require('./config');

const app = express();

// Add the trace middleware first, it will create a request ID for each request
// downstream.
app.use(trace);

//==============================================================================
// PLUGIN PRE APPLICATION MIDDLEWARE
//==============================================================================

// Inject server route plugins.
plugins.get('server', 'app').forEach(({ plugin, app: callback }) => {
  debug(`added plugin '${plugin.name}'`);

  // Pass the app to the plugin to mount it's routes.
  callback(app);
});

//==============================================================================
// APPLICATION WIDE MIDDLEWARE
//==============================================================================

// Add the logging middleware only if we aren't testing.
if (process.env.NODE_ENV !== 'test') {
  app.use(logging.log);
}

if (ENABLE_TRACING && APOLLO_ENGINE_KEY) {
  const { Engine } = require('apollo-engine');

  const engine = new Engine({
    engineConfig: {
      apiKey: APOLLO_ENGINE_KEY,
    },
    graphqlPort: PORT,
    endpoint: `${MOUNT_PATH}api/v1/graph/ql`,
  });

  engine.start();

  app.use(engine.expressMiddleware());
}

// Trust the first proxy in front of us, this will enable us to trust the fact
// that SSL was terminated correctly.
app.set('trust proxy', 1);

// Enable a suite of security good practices through helmet. We disable
// frameguard to allow crossdomain injection of the embed.
app.use(
  helmet(
    merge(HELMET_CONFIGURATION, {
      frameguard: false,
    })
  )
);

//==============================================================================
// VIEW CONFIGURATION
//==============================================================================

// configure the default views directory.
const views = path.join(__dirname, 'views');
app.set('views', views);

// reconfigure nunjucks.
cons.requires.nunjucks = nunjucks.configure(views, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
  watch: process.env.NODE_ENV === 'development',
});

// assign the nunjucks engine to .njk files.
app.engine('njk', cons.nunjucks);

// assign the ejs engine to .ejs and .html files.
app.engine('ejs', cons.ejs);
app.engine('html', cons.ejs);

// set .ejs as the default extension.
app.set('view engine', 'ejs');

//==============================================================================
// ROUTES
//==============================================================================

debug(`mounting routes on the ${MOUNT_PATH} path`);

// Actually apply the routes.
app.use(MOUNT_PATH, routes);

module.exports = app;
