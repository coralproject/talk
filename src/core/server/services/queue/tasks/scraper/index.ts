import Queue, { Job } from "bull";
import Logger from "bunyan";
import cheerio from "cheerio";
import authorScraper from "metascraper-author";
import dateScraper from "metascraper-date";
import descriptionScraper from "metascraper-description";
import imageScraper from "metascraper-image";
import titleScraper from "metascraper-title";
import { Db } from "mongodb";

import { GQLStoryMetadata } from "talk-server/graph/tenant/schema/__generated__/types";
import logger from "talk-server/logger";
import { updateStory } from "talk-server/models/story";
import Task from "talk-server/services/queue/Task";
import { modifiedScraper } from "./rules/modified";
import { sectionScraper } from "./rules/section";

const JOB_NAME = "scraper";

export interface ScrapeProcessorOptions {
  mongo: Db;
}

export interface ScraperData {
  storyID: string;
  storyURL: string;
  tenantID: string;
}

const createJobProcessor = (options: ScrapeProcessorOptions) => async (
  job: Job<ScraperData>
) => {
  // Pull out the job data.
  const { storyID: id, storyURL: url, tenantID } = job.data;

  logger.debug(
    {
      job_id: job.id,
      job_name: JOB_NAME,
      story_id: id,
      story_url: url,
      tenant_id: tenantID,
    },
    "starting to scrap the story"
  );

  // Get the metadata from the scraped html.
  const metadata = await scraper.scrape(url);
  if (!metadata) {
    logger.error(
      {
        job_id: job.id,
        job_name: JOB_NAME,
        story_id: id,
        story_url: url,
        tenant_id: tenantID,
      },
      "story at specified url not found, can not scrape"
    );
    return;
  }

  // Update the Story with the scraped details.
  const story = await updateStory(options.mongo, tenantID, id, {
    metadata,
    scrapedAt: new Date(),
  });
  if (!story) {
    logger.error(
      {
        job_id: job.id,
        job_name: JOB_NAME,
        story_id: id,
        story_url: url,
        tenant_id: tenantID,
      },
      "story at specified id not found, can not update with metadata"
    );
    return;
  }

  logger.debug(
    {
      job_id: job.id,
      job_name: JOB_NAME,
      story_id: story.id,
      story_url: url,
      tenant_id: tenantID,
    },
    "scraped the story"
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
  private log: Logger;

  constructor(rules: Rule[]) {
    this.rules = rules;
    this.log = logger.child({ taskName: "scraper" });
  }

  public async scrape(url: string): Promise<GQLStoryMetadata | null> {
    // Grab the page HTML.

    const log = this.log.child({ storyURL: url });

    const start = Date.now();
    log.debug("starting scrape of Story");

    // TODO: investigate adding scraping proxy support based on the Tenant.
    const res = await fetch(url, {});
    if (res.status !== 200) {
      log.warn(
        { statusCode: res.status },
        "scrape failed with non-200 status code"
      );
      return null;
    }

    const html = await res.text();

    log.debug({ timeElapsed: Date.now() - start }, "scrape complete");

    // Load the DOM.
    const htmlDom = cheerio.load(html);

    log.debug("parsed html");

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

    log.debug("extracted metadata");

    return {
      title: metadata.title || undefined,
      description: metadata.description || undefined,
      image: metadata.image ? metadata.image : undefined,
      author: metadata.author || undefined,
      publishedAt: metadata.date ? new Date(metadata.date) : undefined,
      modifiedAt: metadata.modified ? new Date(metadata.modified) : undefined,
      section: metadata.section || undefined,
    };
  }
}

/**
 * createScraper will create a scraper that will utilize the rules defined to
 * scrape metadata from the target page.
 */
function createScraper() {
  return new Scraper([
    authorScraper(),
    dateScraper(),
    descriptionScraper(),
    imageScraper(),
    titleScraper(),
    modifiedScraper(),
    sectionScraper(),
  ]);
}

export const scraper = createScraper();

export function createScraperTask(
  queue: Queue.QueueOptions,
  options: ScrapeProcessorOptions
) {
  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
    queue,
  });
}
