import Queue, { Job } from "bull";
import cheerio from "cheerio";
import authorScraper from "metascraper-author";
import dateScraper from "metascraper-date";
import descriptionScraper from "metascraper-description";
import imageScraper from "metascraper-image";
import titleScraper from "metascraper-title";
import { Db } from "mongodb";

import logger from "talk-server/logger";
import { updateAsset } from "talk-server/models/asset";
import Task from "talk-server/services/queue/Task";
import { modifiedScraper } from "./rules/modified";
import { sectionScraper } from "./rules/section";

const JOB_NAME = "scraper";

export interface ScrapeProcessorOptions {
  mongo: Db;
}

export interface ScraperData {
  assetID: string;
  assetURL: string;
  tenantID: string;
}

const createJobProcessor = (
  options: ScrapeProcessorOptions,
  scraper: Scraper
) => async (job: Job<ScraperData>) => {
  // Pull out the job data.
  const { assetID: id, assetURL: url, tenantID } = job.data;

  logger.debug(
    {
      job_id: job.id,
      job_name: JOB_NAME,
      asset_id: id,
      asset_url: url,
      tenant_id: tenantID,
    },
    "starting to scrap the asset"
  );

  // Get the metadata from the scraped html.
  const meta = await scraper.scrape(url);
  if (!meta) {
    logger.error(
      {
        job_id: job.id,
        job_name: JOB_NAME,
        asset_id: id,
        asset_url: url,
        tenant_id: tenantID,
      },
      "asset at specified url not found, can not scrape"
    );
    return;
  }

  // Update the Asset with the scraped details.
  const asset = await updateAsset(options.mongo, tenantID, id, {
    title: meta.title || undefined,
    description: meta.description || undefined,
    image: meta.image ? meta.image : undefined,
    author: meta.author || undefined,
    publication_date: meta.date ? new Date(meta.date) : undefined,
    modified_date: meta.modified ? new Date(meta.modified) : undefined,
    section: meta.section || undefined,
    scraped: new Date(),
  });
  if (!asset) {
    logger.error(
      {
        job_id: job.id,
        job_name: JOB_NAME,
        asset_id: id,
        asset_url: url,
        tenant_id: tenantID,
      },
      "asset at specified id not found, can not update with metadata"
    );
    return;
  }

  logger.debug(
    {
      job_id: job.id,
      job_name: JOB_NAME,
      asset_id: asset.id,
      asset_url: url,
      tenant_id: tenantID,
    },
    "scraped the asset"
  );
};

export type Rule = Record<
  string,
  Array<
    (options: { htmlDom: CheerioSelector; url: string }) => string | undefined
  >
>;

class Scraper {
  private rules: Rule[];

  constructor(rules: Rule[]) {
    this.rules = rules;
  }

  public async scrape(url: string) {
    // Grab the page HTML.

    // TODO: investigate adding scraping proxy support.
    const res = await fetch(url, {});
    if (res.status !== 200) {
      return;
    }

    const html = await res.text();

    // Load the DOM.
    const htmlDom = cheerio.load(html);

    // Gather the results by evaluating each of the rules.
    const metadata: Record<string, string | undefined> = {};

    for (const rule of this.rules) {
      for (const property in rule) {
        if (!rule.hasOwnProperty(property)) {
          continue;
        }

        // Proceed through each of the properties and try to find the mapped
        // properties.
        for (const getter of rule[property]) {
          const value = getter({ htmlDom, url });
          if (value && value.length > 0) {
            metadata[property] = value;

            break;
          }
        }
      }
    }

    return metadata;
  }
}

export function createScraperTask(
  queue: Queue.QueueOptions,
  options: ScrapeProcessorOptions
) {
  // Create the scraper object.
  const scraper = new Scraper([
    authorScraper(),
    dateScraper(),
    descriptionScraper(),
    imageScraper(),
    titleScraper(),
    modifiedScraper(),
    sectionScraper(),
  ]);

  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options, scraper),
    queue,
  });
}
