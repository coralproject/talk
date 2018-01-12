const app = require('./app');
const debug = require('debug')('talk:cli:serve');
const errors = require('./errors');
const { createServer } = require('http');
const scraper = require('./services/scraper');
const mailer = require('./services/mailer');
const MigrationService = require('./services/migration');
const SetupService = require('./services/setup');
const kue = require('./services/kue');
const mongoose = require('./services/mongoose');
const cache = require('./services/cache');
const util = require('./bin/util');
const { createSubscriptionManager } = require('./graph/subscriptions');
const { PORT } = require('./config');

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
  let addr = server.address();
  let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`API Server Listening on ${bind}`);
}

/**
 * Start the app.
 */
async function serve({ jobs = false, websockets = false } = {}) {
  // Start the cache instance.
  await cache.init();

  try {
    // Check to see if the application is installed. If the application
    // has been installed, then it will throw errors.ErrSettingsNotInit, this
    // just means we don't have to check that the migrations have run.
    await SetupService.isAvailable();

    debug('setup is currently available, migrations not being checked');
  } catch (e) {
    // Check the error.
    switch (e) {
      case (errors.ErrInstallLock, errors.ErrSettingsInit):
        debug('setup is not currently available, migrations now being checked');

        // The error was expected, just continue.
        break;
      default:
        // The error was not expected, throw the error!
        throw e;
    }

    // Now try and check the migration status.
    try {
      // Verify that the minimum migration version is met.
      await MigrationService.verify();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    debug('migrations do not have to be run');
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
      console.log(`Websocket Server Listening on ${port}`);

      // Mount the subscriptions server on the application server.
      createSubscriptionManager(server);
    }
  });

  // Enable job processing on the thread if enabled.
  if (jobs) {
    // Start the scraper processor.
    scraper.process();

    // Start the mail processor.
    mailer.process();
  }

  // Define a safe shutdown function to call in the event we need to shutdown
  // because the node hooks are below which will interrupt the shutdown process.
  // Shutdown the mongoose connection, the app server, and the scraper.
  util.onshutdown([
    () => (jobs ? kue.Task.shutdown() : null),
    () => mongoose.disconnect(),
    () => server.close(),
  ]);
}

module.exports = serve;
