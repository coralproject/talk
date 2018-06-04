const Asset = require('../../models/asset');
const scraper = require('../../services/scraper');
const Assets = require('../../services/assets');
const { createLogger } = require('../../services/logging');
const logger = createLogger('jobs:scraper');
const fetch = require('node-fetch');
const { merge } = require('lodash');
const { version } = require('../../package.json');
const { SCRAPER_HEADERS, SCRAPER_PROXY_URL } = require('../../config');
const HttpsProxyAgent = require('https-proxy-agent');

// Load the scraper with the rules.
const metascraper = require('metascraper').load([
  require('metascraper-title')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('./rules/modified')(),
  require('./rules/section')(),
]);

let customHeaders = {};
try {
  customHeaders = JSON.parse(SCRAPER_HEADERS);
} catch (err) {
  console.error('Cannot parse TALK_SCRAPER_HEADERS');
  throw err;
}

// Parse the headers to be added to the scraper.
const headers = merge(
  {
    'User-Agent': `Coral-Talk/${version}`,
  },
  customHeaders
);

// Add proxy configuration if exists.
const agent = SCRAPER_PROXY_URL ? new HttpsProxyAgent(SCRAPER_PROXY_URL) : null;

/**
 * Scrapes the given asset for metadata.
 */
async function scrape({ url }) {
  const res = await fetch(url, {
    headers,
    agent,
  });
  const html = await res.text();

  // Get the metadata from the scraped html.
  const metadata = await metascraper({
    html,
    url,
  });
  return metadata;
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
