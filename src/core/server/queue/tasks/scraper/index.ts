import Queue, { Job } from "bull";
import { Db } from "mongodb";

import logger from "talk-server/logger";
import Task from "talk-server/queue/Task";
import { scrape } from "talk-server/services/stories/scraper";

const JOB_NAME = "scraper";

export interface ScrapeProcessorOptions {
  mongo: Db;
}

export interface ScraperData {
  storyID: string;
  storyURL: string;
  tenantID: string;
}

const createJobProcessor = ({ mongo }: ScrapeProcessorOptions) => async (
  job: Job<ScraperData>
) => {
  // Pull out the job data.
  const { storyID, storyURL, tenantID } = job.data;

  const log = logger.child({
    jobID: job.id,
    jobName: JOB_NAME,
    storyID,
    storyURL,
    tenantID,
  });

  log.debug("starting to scrape the story");

  try {
    await scrape(mongo, tenantID, storyID, storyURL);
    log.debug("scraped the story");
  } catch (err) {
    log.error({ err }, "could not scrape the story");

    throw err;
  }
};

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
