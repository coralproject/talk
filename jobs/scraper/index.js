const Asset = require('../../models/asset');
const scraper = require('../../services/scraper');
const Assets = require('../../services/assets');
const { createLogger } = require('../../services/logging');
const logger = createLogger('jobs:scraper');
const { merge } = require('lodash');

/**
 * Updates an Asset based on scraped asset metadata.
 */
function update(id, meta) {
  return Asset.update(
    { id },
    {
      $set: merge(meta, {
        scraped: new Date(),
      }),
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
      const meta = await scraper.scrape(asset.url);

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
