import { Job, Queue } from "bull";
import { Db } from "mongodb";

import logger from "talk-server/logger";
import { Task } from "talk-server/services/queue/tasks";

const JOB_NAME = "scraper";

export interface ScrapeProcessorOptions {
  mongo: Db;
}

export interface ScraperData {
  id: string;
  url: string;
}

const createJobProcessor = (options: ScrapeProcessorOptions) => async (
  job: Job<ScraperData>
) => {
  logger.debug({ job_id: job.id, job_name: JOB_NAME }, "scraped the asset");

  // FIXME: (wyattjoh) implement.
};

export function createScraperTask(
  queue: Queue<ScraperData>,
  options: ScrapeProcessorOptions
) {
  return new Task(queue, {
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
  });
}
