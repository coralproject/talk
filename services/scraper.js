const kue = require('./kue');
const debug = require('debug')('talk:services:scraper');
const AssetModel = require('../models/asset');
const AssetsService = require('./assets');

const metascraper = require('metascraper');

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
  create(asset) {
    debug(`Creating job for Asset[${asset.id}]`);

    return scraper.task
      .create({
        title: `Scrape for asset ${asset.id}`,
        asset_id: asset.id,
      })
      .then(job => {
        debug(`Created Job[${job.id}] for Asset[${asset.id}]`);

        return job;
      });
  },

  /**
   * Scrapes the given asset for metadata.
   */
  async scrape(asset) {
    return metascraper.scrapeUrl(
      asset.url,
      Object.assign({}, metascraper.RULES, {
        section: $ => $('meta[property="article:section"]').attr('content'),
        modified: $ => $('meta[property="article:modified"]').attr('content'),
      })
    );
  },

  /**
   * Updates an Asset based on scraped asset metadata.
   */
  update(id, meta) {
    return AssetModel.update(
      { id },
      {
        $set: {
          title: meta.title || '',
          description: meta.description || '',
          image: meta.image ? meta.image : '',
          author: meta.author || '',
          publication_date: meta.date || '',
          modified_date: meta.modified || '',
          section: meta.section || '',
          scraped: new Date(),
        },
      }
    );
  },

  /**
   * Start the queue processor for the scraper job.
   */
  process() {
    debug(`Now processing ${scraper.task.name} jobs`);

    scraper.task.process(async (job, done) => {
      debug(`Starting on Job[${job.id}] for Asset[${job.data.asset_id}]`);

      try {
        // Find the asset, or complain that it doesn't exist.
        const asset = await AssetsService.findById(job.data.asset_id);
        if (!asset) {
          return done(new Error('asset not found'));
        }

        // Scrape the metadata from the asset.
        const meta = await scraper.scrape(asset);

        debug(
          `Scraped ${JSON.stringify(meta)} on Job[${job.id}] for Asset[${
            job.data.asset_id
          }]`
        );

        // Assign the metadata retrieved for the asset to the db.
        await scraper.update(job.data.asset_id, meta);
      } catch (err) {
        debug(
          `Failed to scrape on Job[${job.id}] for Asset[${job.data.asset_id}]:`,
          err
        );
        return done(err);
      }

      debug(`Finished on Job[${job.id}] for Asset[${job.data.asset_id}]`);
      done();
    });
  },
};

module.exports = scraper;
