const Asset = require('../models/asset');
const scraper = require('../services/scraper');
const Assets = require('../services/assets');
const { createLogger } = require('../services/logging');
const logger = createLogger('jobs:scraper');
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
  logger.info({ taskName: scraper.task.name }, 'Now processing jobs');

  scraper.task.process(async (job, done) => {
    const { id, asset_id } = job.data;

    const log = logger.child({ traceID: id, jobID: job.id, assetID: asset_id });
    log.info('Starting scrape');

    try {
      // Find the asset, or complain that it doesn't exist.
      const asset = await Assets.findById(job.data.asset_id);
      if (!asset) {
        throw new Error('asset not found');
      }

      // Scrape the metadata from the asset.
      const meta = await scrape(asset);

      log.info('Finished scraping');

      // Assign the metadata retrieved for the asset to the db.
      await update(job.data.asset_id, meta);
    } catch (err) {
      log.error({ err }, 'Failed to scrape');
      return done(err);
    }

    log.info('Finished updating');
    done();
  });
};
