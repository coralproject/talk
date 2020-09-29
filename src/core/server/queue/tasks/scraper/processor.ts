import { inject, singleton } from "tsyringe";

import { CONFIG, Config } from "coral-server/config";
import { createTimer } from "coral-server/helpers";
import {
  JobProcessor,
  JobProcessorHandler,
} from "coral-server/queue/processor";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import { scrape } from "coral-server/services/stories/scraper";

export const JOB_NAME = "scraper";

export interface ScraperData {
  storyID: string;
  storyURL: string;
  tenantID: string;
}

@singleton()
export class ScraperQueueProcessor implements JobProcessor<ScraperData> {
  constructor(
    @inject(MONGO) private readonly mongo: Mongo,
    @inject(CONFIG) private readonly config: Config
  ) {}

  public process: JobProcessorHandler<ScraperData> = async (logger, job) => {
    // Pull out the job data.
    const { storyID, storyURL, tenantID } = job.data;

    // Mark the start time.
    const timer = createTimer();

    logger.debug(
      {
        storyID,
        storyURL,
        tenantID,
      },
      "starting to scrape the story"
    );

    await scrape(this.mongo, this.config, tenantID, storyID, storyURL);

    // Compute the end time.
    logger.debug({ responseTime: timer() }, "scraped the story");
  };
}
