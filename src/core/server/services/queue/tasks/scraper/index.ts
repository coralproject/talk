import { Job, Queue } from "bull";
import metascraper, { Scraper } from "metascraper";
import { Db } from "mongodb";

import logger from "talk-server/logger";
import { updateAsset } from "talk-server/models/asset";
import { Task } from "talk-server/services/queue/tasks";
import { modified } from "./rules/modified";
import { section } from "./rules/section";

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

  // Grab the page HTML.
  const res = await fetch(url, {});
  const html = await res.text();

  // Get the metadata from the scraped html.
  const meta = await scraper({
    html,
    url,
  });

  // Update the Asset with the scraped details.
  await updateAsset(options.mongo, tenantID, id, {
    title: meta.title || undefined,
    description: meta.description || undefined,
    image: meta.image ? meta.image : undefined,
    author: meta.author || undefined,
    publication_date: meta.date ? new Date(meta.date) : undefined,
    modified_date: meta.modified ? new Date(meta.modified) : undefined,
    section: meta.section || undefined,
    scraped: new Date(),
  });

  logger.debug(
    { job_id: job.id, job_name: JOB_NAME, asset_id: id, tenant_id: tenantID },
    "scraped the asset"
  );
};

export function createScraperTask(
  queue: Queue<ScraperData>,
  options: ScrapeProcessorOptions
) {
  // Create the scraper object.
  const scraper = metascraper.load([
    require("metascraper-title")(),
    require("metascraper-description")(),
    require("metascraper-image")(),
    require("metascraper-author")(),
    require("metascraper-date")(),
    modified(),
    section(),
  ]);

  return new Task(queue, {
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options, scraper),
  });
}
