import Queue, { Job } from "bull";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import Task from "coral-server/queue/Task";
import { scrape } from "coral-server/services/stories/scraper";

const JOB_NAME = "scraper";

export interface ScrapeProcessorOptions {
  mongo: MongoContext;
  config: Config;
}

export interface ScraperData {
  storyID: string;
  storyURL: string;
  tenantID: string;
}

const createJobProcessor =
  ({ mongo, config }: ScrapeProcessorOptions) =>
  async (job: Job<ScraperData>) => {
    // Pull out the job data.
    const { storyID, storyURL, tenantID } = job.data;

    const log = logger.child(
      {
        jobID: job.id,
        jobName: JOB_NAME,
        storyID,
        storyURL,
        tenantID,
      },
      true
    );

    // Mark the start time.
    const timer = createTimer();

    log.debug("starting to scrape the story");
    await scrape(mongo, config, tenantID, storyID, storyURL);

    // Compute the end time.
    log.debug({ responseTime: timer() }, "scraped the story");
  };

export type ScraperQueue = Task<ScraperData>;

export function createScraperTask(
  queue: Queue.QueueOptions,
  options: ScrapeProcessorOptions
) {
  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
    queue,
    // Timeout the job processor twice the time of the scrape timeout. This will
    // give the scraper a chance to time itself out after the scraper fails, but
    // will catch it if the scraping takes too long.
    timeout: options.config.get("scrape_timeout") * 2,
    // We will generate a stable job ID for these scrape jobs. This ensures that
    // we cannot add multiple scraper jobs for the same story multiple times
    // while one is already in progress.
    jobIdGenerator: ({ tenantID, storyID }) => `${tenantID}:${storyID}`,
  });
}
