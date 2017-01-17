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
util.shutdown = (defaultCode = 0) => {
  Promise
    .all(util.toshutdown.map((func) => func ? func() : null).filter((func) => func))
    .then(() => {
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

  // Add the new jobs to shutdown to the object reference.
  util.toshutdown = util.toshutdown.concat(jobs);
};

// Attach to the SIGTERM + SIGINT handles to ensure a clean shutdown in the
// event that we have an external event. SIGUSR2 is called when the app is asked
// to be 'killed', same procedure here.
process.on('SIGTERM',   () => util.shutdown());
process.on('SIGINT',    () => util.shutdown());
process.once('SIGUSR2', () => util.shutdown());
