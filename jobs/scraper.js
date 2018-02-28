const Asset = require('../models/asset');
const scraper = require('../services/scraper');
const Assets = require('../services/assets');
const debug = require('debug')('talk:jobs:scraper');
const metascraper = require('metascraper');

/**
 * Scrapes the given asset for metadata.
 */
async function scrape(asset) {
  return metascraper.scrapeUrl(
    asset.url,
    Object.assign({}, metascraper.RULES, {
      section: $ => $('meta[property="article:section"]').attr('content'),
      modified: $ => $('meta[property="article:modified"]').attr('content'),
    })
  );
}

/**
 * Updates an Asset based on scraped asset metadata.
 */
function update(id, meta) {
  return Asset.update(
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
}

module.exports = () => {
  debug(`Now processing ${scraper.task.name} jobs`);

  scraper.task.process(async (job, done) => {
    debug(`Starting on Job[${job.id}] for Asset[${job.data.asset_id}]`);

    try {
      // Find the asset, or complain that it doesn't exist.
      const asset = await Assets.findById(job.data.asset_id);
      if (!asset) {
        return done(new Error('asset not found'));
      }

      // Scrape the metadata from the asset.
      const meta = await scrape(asset);

      debug(
        `Scraped ${JSON.stringify(meta)} on Job[${job.id}] for Asset[${
          job.data.asset_id
        }]`
      );

      // Assign the metadata retrieved for the asset to the db.
      await update(job.data.asset_id, meta);
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
};
