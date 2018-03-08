const kue = require('./kue');

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
  async create(ctx, id) {
    ctx.log.info({ assetID: id }, 'Creating job');

    const job = await scraper.task.create({
      title: `Scrape for asset ${id}`,
      id: ctx.id,
      asset_id: id,
    });

    ctx.log.info({ jobID: job.id, assetID: id }, 'Created job');

    return job;
  },
};

module.exports = scraper;
