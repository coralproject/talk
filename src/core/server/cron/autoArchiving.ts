import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { retrieveLockedStoryToBeArchived } from "coral-server/models/story";
import { archiveStory } from "coral-server/services/archive";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

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
  log,
  mongo,
  redis,
  tenantCache,
  config,
}) => {
  const enabled = config.get("enable_auto_archiving");
  if (!enabled) {
    log.info("cancelling auto archiving operation as it is not enabled");
    return;
  }

  const amount = config.get("auto_archiving_batch_size");
  const age = config.get("auto_archive_older_than");

  for await (const tenant of tenantCache) {
    log = log.child({ tenantID: tenant.id }, true);

    const now = new Date();
    const dateFilter = new Date(now.getTime() - age);

    let count = 0;
    do {
      const story = await retrieveLockedStoryToBeArchived(
        mongo,
        tenant.id,
        dateFilter,
        now
      );

      if (!story) {
        break;
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
