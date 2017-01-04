const debug = require('debug')('talk:services:kue');
const redis = require('./redis');

module.exports = {};

const kue = module.exports.kue = require('kue');

// Note that unlike what the name createQueue suggests, it currently returns a
// singleton Queue instance. So you can configure and use only a single Queue
// object within your node.js process.
const Queue = module.exports.queue = kue.createQueue({
  redis: {
    createClientFactory: () => redis.createClient()
  }
});

module.exports.Task = class Task {

  constructor({name, attempts = 3, delay = 1000}) {
    this.name = name;
    this.attempts = attempts;
    this.delay = delay;
  }

  /**
   * Add a new job to the queue.
   */
  create(data) {

    debug(`Creating new job for Queue[${this.name}]`);

    return new Promise((resolve, reject) => {
      let job = Queue
        .create(this.name, data)
        .attempts(this.attempts)
        .delay(this.delay)
        .backoff({type: 'exponential'})
        .save((err) => {
          if (err) {
            return reject(err);
          }

          debug(`Job[${job.id}] created on Queue[${this.name}]`);

          return resolve(job);
        });
    });
  }

  /**
   * Process jobs for the queue.
   */
  process(callback) {
    return Queue.process(this.name, callback);
  }

  /**
   * Shutdown running jobs.
   */
  static shutdown() {

    debug('Shutting down the Queue');

    return new Promise((resolve, reject) => {

      // Shutdown and give the queue 5 seconds to shutdown before we start
      // killing jobs.
      Queue.shutdown(5000, (err) => {
        if (err) {
          return reject(err);
        }

        debug('Queue shut down.');

        resolve();
      });
    });
  }
};
