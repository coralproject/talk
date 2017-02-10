const debug = require('debug')('talk:util');
const fs = require('fs');

const util = module.exports = {};

/**
 * Stores an array of functions that should be executed in the event that the
 * application needs to shutdown.
 * @type {Array}
 */
util.toshutdown = [];

/**
 * Calls all the shutdown functions and then ends the process.
 * @param  {Number} [defaultCode=0] default return code upon sucesfull shutdown.
 */
util.shutdown = (defaultCode = 0, signal = null) => {

  if (signal) {
    debug(`Reached ${signal} signal`);
  }

  debug(`${util.toshutdown.length} jobs now being called`);

  Promise
    .all(util.toshutdown.map((func) => func ? func(signal) : null).filter((func) => func))
    .then(() => {
      debug('Shutdown complete, now exiting');
      process.exit(defaultCode);
    })
    .catch((err) => {
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
util.onshutdown = (jobs) => {

  debug(`${jobs.length} jobs registered to be called during shutdown`);

  // Add the new jobs to shutdown to the object reference.
  util.toshutdown = util.toshutdown.concat(jobs);
};

/**
 * Register a PID file to be maintained for the lifespan of the process.
 * @param  {String} path path to the PID file to create
 */
util.pid = (path) => {
  if (!/\//.test(path)) {
    if (!/\.pid/.test(path)) {
      path += '.pid';
    }
    path = `/tmp/${path}`;
  }

  const pid = `${process.pid.toString()}\n`;

  fs.writeFile(path, pid, (err) => {
    if (err) {
      console.error(`Can't write PID file: ${err}`);
      throw err;
    }

    // Add the cleanup for the fs onto the shutdown.
    util.onshutdown([
      () => new Promise((resolve, reject) => {

        // Remove the pid file.
        fs.unlink(path, (err) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        });
      })
    ]);
  });
};

// Attach to the SIGTERM + SIGINT handles to ensure a clean shutdown in the
// event that we have an external event. SIGUSR2 is called when the app is asked
// to be 'killed', same procedure here.
process.on('SIGTERM',   () => util.shutdown(0, 'SIGTERM'));
process.on('SIGINT',    () => util.shutdown(0, 'SIGINT'));
process.once('SIGUSR2', () => util.shutdown(0, 'SIGUSR2'));
