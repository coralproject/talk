import Queue, { Job } from "bull";
import { Db } from "mongodb";
import now from "performance-now";

import logger from "talk-server/logger";
import Task from "talk-server/queue/Task";
import { Elasticsearch } from "talk-server/services/elasticsearch";
import { scrape } from "talk-server/services/stories/scraper";

const JOB_NAME = "scraper";

export interface ScrapeProcessorOptions {
  mongo: Db;
  elasticsearch: Elasticsearch;
}

export interface ScraperData {
  storyID: string;
  storyURL: string;
  tenantID: string;
}

const createJobProcessor = ({
  mongo,
  elasticsearch,
}: ScrapeProcessorOptions) => async (job: Job<ScraperData>) => {
  // Pull out the job data.
  const { storyID, storyURL, tenantID } = job.data;

  const log = logger.child({
    jobID: job.id,
    jobName: JOB_NAME,
    storyID,
    storyURL,
    tenantID,
  });

  // Mark the start time.
  const startTime = now();

  log.debug("starting to scrape the story");

  try {
    await scrape(mongo, elasticsearch, tenantID, storyID, storyURL);
  } catch (err) {
    log.error({ err }, "could not scrape the story");

    throw err;
  }

  // Compute the end time.
  const responseTime = Math.round(now() - startTime);

  log.debug({ responseTime }, "scraped the story");
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
  });
}
