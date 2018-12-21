const fetch = require('node-fetch');
const ProxyAgent = require('proxy-agent');
const { merge } = require('lodash');

const { SCRAPER_HEADERS, SCRAPER_PROXY_URL } = require('../../config');
const kue = require('../kue');
const { version } = require('../../package.json');

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
const agent = SCRAPER_PROXY_URL ? new ProxyAgent(SCRAPER_PROXY_URL) : null;

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

  /**
   * Scrapes the given asset for metadata.
   */
  async scrape(url) {
    const res = await fetch(url, {
      headers,
      agent,
    });
    const html = await res.text();

    // Get the metadata from the scraped html.
    const meta = await metascraper({
      html,
      url,
    });

    return {
      title: meta.title || '',
      description: meta.description || '',
      image: meta.image ? meta.image : '',
      author: meta.author || '',
      publication_date: meta.date || '',
      modified_date: meta.modified || '',
      section: meta.section || '',
    };
  },
};

module.exports = scraper;
