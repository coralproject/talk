const debug = require('debug')('talk:services:kue');
const redis = require('./redis');

module.exports = {};

const kue = require('kue');

// Note that unlike what the name createQueue suggests, it currently returns a
// singleton Queue instance. So you can configure and use only a single Queue
// object within your node.js process.
let queue = null;
let isManaging = false;
const getQueue = ({ managed = false } = {}) => {
  if (queue) {
    return queue;
  }

  debug('init the queue');
  queue = kue.createQueue({
    redis: {
      createClientFactory: () => redis.createClient(),
    },
  });

  // If this is a managed queue, and we aren't managing yet, then start the
  // management.
  if (managed && !isManaging) {
    // Watch for stuck jobs to manage.
    queue.watchStuckJobs(60000);

    // Mark that we've now started management routines.
    isManaging = true;
  }

  return queue;
};

class Task {
  constructor({ name, attempts = 3, delay = 1000 }) {
    debug(`Created new Task[${name}]`);

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
      let job = getQueue()
        .create(this.name, data)
        .attempts(this.attempts)
        .delay(this.delay)
        .backoff({ type: 'exponential' })
        .removeOnComplete(true)
        .save(err => {
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
    // Get the queue in managed mode.
    return getQueue({ managed: true }).process(this.name, callback);
  }

  /**
   * Connect to redis now by getting the queue.
   */
  static connect() {
    // Force setup the redis connection for kue.
    getQueue();
  }

  /**
   * Shutdown running jobs.
   */
  static shutdown() {
    debug('Shutting down the Queue');

    return new Promise(resolve => {
      // Shutdown and give the queue 5 seconds to shutdown before we start
      // killing jobs.
      getQueue().shutdown(5000, err => {
        if (err) {
          return resolve();
        }

        debug('Queue shut down.');

        resolve();
      });
    });
  }
}

/**
 * Stores the tasks during testing.
 * @type {Array}
 */
const TestQueue = [];

/**
 * TestTask is a Task queue that is implemented for when the application is in
 * test mode, and does not send the jobs to redis, instead it queues them in
 * an array which can be inspected.
 */
class TestTask {
  constructor({ name }) {
    this.name = name;
  }

  /**
   * Push the task into the fake queue.
   */
  create(task) {
    let id = TestQueue.push({
      name: this.name,
      task,
    });

    return Promise.resolve({ id });
  }

  // This is a NO-OP action simply provided to match the Task interface.
  process() {
    return null;
  }

  /**
   * Returns the current tasks for this queue.
   * @return {Array} the tasks in the queue
   */
  get tasks() {
    return TestQueue.filter(testTask => testTask.name === this.name).map(
      testTask => testTask.task
    );
  }

  static shutdown() {
    return Task.shutdown();
  }
}

if (process.env.NODE_ENV === 'test') {
  module.exports.Task = TestTask;
  module.exports.TestQueue = TestQueue;
} else {
  module.exports.Task = Task;
}

// Add the job reference to the exported params.
module.exports.Job = kue.Job;
