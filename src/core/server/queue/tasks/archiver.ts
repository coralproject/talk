import { QueueOptions } from "bull";

import { MongoContext } from "coral-server/data/context";
import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import { forceMarkStoryForArchiving } from "coral-server/models/story";
import Task, { JobProcessor } from "coral-server/queue/Task";
import { archiveStory } from "coral-server/services/archive";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

const JOB_NAME = "archiver";

export interface ArchiverProcessorOptions {
  mongo: MongoContext;
  redis: AugmentedRedis;
  tenantCache: TenantCache;
}

export interface ArchiverData {
  tenantID: string;
  storyID: string;
}

const createJobProcessor =
  ({
    mongo,
    redis,
    tenantCache,
  }: ArchiverProcessorOptions): JobProcessor<ArchiverData> =>
  async (job) => {
    const { storyID, tenantID } = job.data;

    const log = logger.child(
      {
        jobID: job.id,
        jobName: JOB_NAME,
        storyID,
        tenantID,
      },
      true
    );

    const timer = createTimer();

    log.info("attempting to archive story");

    // Get the tenant.
    const tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      return;
    }

    const now = new Date();

    const story = await forceMarkStoryForArchiving(
      mongo,
      tenantID,
      storyID,
      now
    );

    if (!story) {
      log.warn(
        { storyID },
        "auto archiving was unable to lock story for archiving"
      );
      return;
    }

    log.info({ storyID }, "found story, proceeding with archiving");

    // If we have the document, we have the archiving lock and
    // can proceed to archive
    const result = await archiveStory(
      mongo,
      redis,
      tenant.id,
      story.id,
      log,
      now
    );

    if (result?.isArchived && !result?.isArchiving) {
      log.info({ storyID }, "successfully archived story");
    } else {
      log.error({ storyID }, "unable to archive story");
      throw new Error("unable to archive story");
    }

    log.debug({ took: timer() }, "attempted archive operation ended");
  };

export type ArchiverQueue = Task<ArchiverData>;

export function createArchiverTask(
  queue: QueueOptions,
  options: ArchiverProcessorOptions
) {
  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
    queue,
    jobIdGenerator: ({ tenantID, storyID }) => `${tenantID}:${storyID}`,
    attempts: 1,
  });
}
