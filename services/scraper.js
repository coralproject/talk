const kue = require('../kue');
const debug = require('debug')('talk:services:scraper');
const Asset = require('../models/asset');
const JOB_NAME = 'scraper';

const metascraper = require('metascraper');

/**
 * Exposes a service object to allow operations to execute against the scraper.
 * @type {Object}
 */
const scraper = {

  /**
   * creates a new scraper job and scrapes the url when it gets processed.
   */
  create(asset) {
    return new Promise((resolve, reject) => {
      debug(`Creating job for Asset[${asset.id}]`);

      let job = kue.queue
        .create(JOB_NAME, {
          title: `Scrape for asset ${asset.id}`,
          asset_id: asset.id
        })
        .attempts(10)
        .delay(1000)
        .backoff({type: 'exponential'})
        .save((err) => {
          if (err) {
            return reject(err);
          }

          debug(`Created Job[${job.id}] for Asset[${asset.id}]`);

          return resolve(job);
        });
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

  update(id, meta) {
    return Asset.update({id}, {
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

    debug(`Now processing ${JOB_NAME} jobs`);

    // Process jobs with the processJob function.
    kue.queue.process(JOB_NAME, (job, done) => {

      debug(`Starting on Job[${job.id}] for Asset[${job.data.asset_id}]`);

      Asset

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
          console.error(`Failed to scrape on Job[${job.id}] for Asset[${job.data.asset_id}]:`, err);

          done(err);
        });
    });
  },

  /**
   * Shuts down the current queue to ensure that the application can shutdown
   * cleanly.
   */
  shutdown() {
    return new Promise((resolve, reject) => {

      // Shutdown and give the queue 5 seconds to shutdown before we start
      // killing jobs.
      kue.queue.shutdown(5000, (err) => {
        if (err) {
          return reject(err);
        }

        debug(`Processing for ${JOB_NAME} jobs stopped`);

        resolve();
      });
    });
  }

};

module.exports = scraper;
