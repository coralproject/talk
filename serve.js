const app = require('./app');
const { ErrSettingsInit, ErrInstallLock } = require('./errors');
const { createServer } = require('http');
const jobs = require('./jobs');
const MigrationService = require('./services/migration');
const SetupService = require('./services/setup');
const PluginsService = require('./services/plugins');
const kue = require('./services/kue');
const mongoose = require('./services/mongoose');
const cache = require('./services/cache');
const util = require('./bin/util');
const { createSubscriptionManager } = require('./graph/subscriptions');
const { PORT } = require('./config');
const { createLogger } = require('./services/logging');
const logger = createLogger('jobs');

const port = normalizePort(PORT);

/**
 * Create HTTP server.
 */
const server = createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      break;
    default:
      break;
  }

  throw error;
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "listening" event.
 */

async function onListening() {
  logger.info({ port }, 'API server started');
}

/**
 * Start the app.
 */
async function serve({
  jobs: enableJobs = false,
  disabledJobs = [],
  websockets = false,
} = {}) {
  // Run the deferred plugins.
  PluginsService.runDeferred();

  // Start the cache instance.
  await cache.init();

  try {
    // Check to see if the application is installed. If the application
    // has been installed, then it will throw errors.ErrSettingsNotInit, this
    // just means we don't have to check that the migrations have run.
    await SetupService.isAvailable();

    logger.info('Setup is currently available, migrations not being checked');
  } catch (err) {
    // Check the error.
    if (err instanceof ErrInstallLock || err instanceof ErrSettingsInit) {
      // The error was expected, just continue.
      logger.info(
        'Setup is not currently available, migrations now being checked'
      );
    } else {
      // The error was not expected, throw the error!
      throw err;
    }

    // Now try and check the migration status.
    try {
      // Verify that the minimum migration version is met.
      await MigrationService.verify();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    logger.info('Migrations do not have to be run');
  }

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.on('error', onError);
  server.on('listening', onListening);
  server.on('listening', () => {});
  server.listen(port, () => {
    // Mount the websocket server if requested.
    if (websockets) {
      logger.info({ port }, 'Websocket server started');

      // Mount the subscriptions server on the application server.
      createSubscriptionManager(server);
    }
  });

  // Enable job processing on the thread if enabled.
  if (enableJobs) {
    // Start the mail processor.
    jobs.process(...disabledJobs);
  }

  // Define a safe shutdown function to call in the event we need to shutdown
  // because the node hooks are below which will interrupt the shutdown process.
  // Shutdown the mongoose connection, the app server, and the scraper.
  util.onshutdown([
    () => (enableJobs ? kue.Task.shutdown() : null),
    () => mongoose.disconnect(),
    () => server.close(),
  ]);
}

module.exports = serve;
