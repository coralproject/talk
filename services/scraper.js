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
   * Create the new Task kue.
   */
  task: new kue.Task({
    name: 'scraper'
  }),

  /**
   * Creates a new scraper job and scrapes the url when it gets processed.
   */
  create(asset) {

    debug(`Creating job for Asset[${asset.id}]`);

    return scraper.task.create({
      title: `Scrape for asset ${asset.id}`,
      asset_id: asset.id
    }).then((job) => {

      debug(`Created Job[${job.id}] for Asset[${asset.id}]`);

      return job;
    });
  },

  /**
   * Scrapes the given asset for metadata.
   */
  scrape(asset) {
    return metascraper.scrapeUrl(asset.url, Object.assign({}, metascraper.RULES, {
      section: ($) => $('meta[property="article:section"]').attr('content'),
      modified: ($) => $('meta[property="article:modified"]').attr('content')
    }));
  },

  /**
   * Updates an Asset based on scraped asset metadata.
   */
  update(id, meta) {
    return AssetModel.update({id}, {
      $set: {
        title: meta.title || '',
        description: meta.description || '',
        image: meta.image ? meta.image : '',
        author: meta.author || '',
        publication_date: meta.date || '',
        modified_date: meta.modified || '',
        section: meta.section || '',
        scraped: new Date()
      }
    });
  },

  /**
   * Start the queue processor for the scraper job.
   */
  process() {

    debug(`Now processing ${scraper.task.name} jobs`);

    scraper.task.process((job, done) => {

      debug(`Starting on Job[${job.id}] for Asset[${job.data.asset_id}]`);

      AssetsService

        // Find the asset, or complain that it doesn't exist.
        .findById(job.data.asset_id)
        .then((asset) => {
          if (!asset) {
            throw new Error('asset not found');
          }

          return asset;
        })

        // Scrape the metadata from the asset.
        .then(scraper.scrape)

        // Assign the metadata retrieved for the asset to the db.
        .then((meta) => {
          debug(`Scraped ${JSON.stringify(meta)} on Job[${job.id}] for Asset[${job.data.asset_id}]`);

          return scraper.update(job.data.asset_id, meta);
        })

        // Finish the job because we just handled our scraping + updating the
        // asset in the database.
        .then(() => {
          debug(`Finished on Job[${job.id}] for Asset[${job.data.asset_id}]`);
          done();
        })

        // Handle errors that occur.
        .catch((err) => {
          debug(`Failed to scrape on Job[${job.id}] for Asset[${job.data.asset_id}]:`, err);

          done(err);
        });
    });
  }

};

module.exports = scraper;
