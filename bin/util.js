// Setup the environment.
require('../services/env');

const debug = require('debug')('talk:util');
const { uniq } = require('lodash');

// Setup the utilities.
const util = {};

/**
 * Stores an array of functions that should be executed in the event that the
 * application needs to shutdown.
 * @type {Array}
 */
util.toshutdown = [];

/**
 * Calls all the shutdown functions and then ends the process.
 * @param  {Number} [defaultCode=0] default return code upon successful shutdown.
 */
util.shutdown = (defaultCode = 0, signal = null) => {
  if (signal) {
    debug(`Reached ${signal} signal`);
  }

  debug(`${util.toshutdown.length} jobs now being called`);

  Promise.all(util.toshutdown.map(func => (func ? func(signal) : null)))
    .then(() => {
      debug('Shutdown complete, now exiting');
      process.exit(defaultCode);
    })
    .catch(err => {
      console.error(err);

      process.exit(1);
    });
};

/**
 * Waits until an event is triggered by the node runtime and elevates a series
 * of jobs to be ran in the event we need to shutdown.
 * @param  {Array} jobs Array of promise capable shutdown functions that are
 *                      executed.
 */
util.onshutdown = jobs => {
  debug(`${jobs.length} jobs registered to be called during shutdown`);

  // Add the new jobs to shutdown to the object reference.
  util.toshutdown = uniq(util.toshutdown.concat(jobs));
};

// Attach to the SIGTERM + SIGINT handles to ensure a clean shutdown in the
// event that we have an external event. SIGUSR2 is called when the app is asked
// to be 'killed', same procedure here.
process.once('SIGTERM', () => util.shutdown(0, 'SIGTERM'));
process.once('SIGINT', () => util.shutdown(0, 'SIGINT'));
process.once('SIGUSR2', () => util.shutdown(0, 'SIGUSR2'));

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

module.exports = util;
