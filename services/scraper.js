const kue = require('./kue');
const debug = require('debug')('talk:services:scraper');

/**
 * Exposes a service object to allow operations to execute against the scraper.
 * @type {Object}
 */
const scraper = {
  /**
   * Create the new Task kue singleton.
   */
  task: new kue.Task({
    name: 'scraper',
  }),

  /**
   * Creates a new scraper job and scrapes the url when it gets processed.
   */
  async create(asset) {
    debug(`Creating job for Asset[${asset.id}]`);

    const job = await scraper.task.create({
      title: `Scrape for asset ${asset.id}`,
      asset_id: asset.id,
    });

    debug(`Created Job[${job.id}] for Asset[${asset.id}]`);

    return job;
  },
};

module.exports = scraper;
