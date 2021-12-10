import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { forceMarkStoryForArchiving } from "coral-server/models/story";
import { archiveStory } from "coral-server/services/archive";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";
import { REDIS_ARCHIVING_QUEUE_KEY } from "./fillArchivingQueue";

import {
  ScheduledJob,
  ScheduledJobCommand,
  ScheduledJobGroup,
} from "./scheduled";

interface Options {
  mongo: MongoContext;
  redis: AugmentedRedis;
  tenantCache: TenantCache;
  config: Config;
}

export const NAME = "Auto Archiving";

export function registerAutoArchiving(
  options: Options
): ScheduledJobGroup<Options> {
  const cronSchedule = options.config.get("auto_archiving_interval");

  const job = new ScheduledJob(options, {
    name: `Scheduled ${NAME}`,
    cronTime: cronSchedule,
    command: archiveStories,
  });

  return { name: NAME, schedulers: [job] };
}

const archiveStories: ScheduledJobCommand<Options> = async ({
  log: logger,
  mongo,
  redis,
  tenantCache,
  config,
}) => {
  const enabled = config.get("enable_auto_archiving");
  if (!enabled) {
    logger.info("cancelling auto archiving operation as it is not enabled");
    return;
  }

  const amount = config.get("auto_archiving_batch_size");

  for await (const tenant of tenantCache) {
    const log = logger.child({ tenantID: tenant.id }, true);

    const redisKey = `${REDIS_ARCHIVING_QUEUE_KEY}:${tenant.id}`;
    const now = new Date();

    let count = 0;
    do {
      const redisRecords = await redis.spop(redisKey, 1);
      if (redisRecords.length === 0) {
        log.info(
          "stopping since there are no more stories to archive for this tenant"
        );
        break;
      }

      const redisRecord = redisRecords[0];
      const split = redisRecord.split(":");
      if (!split || split.length !== 2) {
        log.warn(
          { record: redisRecord },
          "found malformed archive queue record"
        );
        break;
      }

      const tenantID = split[0];
      const storyID = split[1];

      const story = await forceMarkStoryForArchiving(
        mongo,
        tenantID,
        storyID,
        now
      );

      if (!story) {
        log.warn(
          { storyID },
          "auto archiving was unable to mark story for archiving"
        );
        continue;
      }

      log.info({ storyID: story.id }, "archiving story");

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
        log.info({ storyID: story.id }, "successfully archived story");
      } else {
        log.error({ storyID: story.id }, "unable to archive story");
      }

      count++;
    } while (count < amount);
  }
};
