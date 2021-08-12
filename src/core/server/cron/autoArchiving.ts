import { Db } from "mongodb";

import { Config } from "coral-server/config";
import {
  archiveStory,
  markStoryForArchiving,
  retrieveStoriesToBeArchived,
} from "coral-server/models/story";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  ScheduledJob,
  ScheduledJobCommand,
  ScheduledJobGroup,
} from "./scheduled";

interface Options {
  mongo: Db;
  archive: Db;
  redis: AugmentedRedis;
  tenantCache: TenantCache;
  config: Config;
}

export const NAME = "Auto Archiving";

export function registerAutoArchiving(
  options: Options
): ScheduledJobGroup<Options> {
  const job = new ScheduledJob(options, {
    name: `Daily at midnight ${NAME}`,
    cronTime: "59 23 * * *",
    command: archiveStories,
  });

  return { name: NAME, schedulers: [job] };
}

const archiveStories: ScheduledJobCommand<Options> = async ({
  log,
  mongo,
  archive,
  redis,
  tenantCache,
  config,
}) => {
  const enabled = config.get("enable_auto_archiving");
  if (!enabled) {
    log.info("cancelling auto archiving operation as it is not enabled");
    return;
  }

  const batchSize = config.get("auto_archiving_batch_size");
  const age = config.get("auto_archiving_age");

  // For each of the tenant's, process their users notifications.
  for await (const tenant of tenantCache) {
    log = log.child({ tenantID: tenant.id }, true);

    const now = new Date();
    const dateFilter = new Date(now.getTime() - age);
    const stories = await retrieveStoriesToBeArchived(
      mongo,
      tenant.id,
      dateFilter,
      batchSize
    );

    log.info({ count: stories.length }, "archiving stories");

    stories.forEach(async (s) => {
      log.info({ storyID: s.id }, "archiving story");

      const markResult = await markStoryForArchiving(
        mongo,
        tenant.id,
        s.id,
        now
      );

      // Cannot proceed if we can't lock the story for archiving,
      // continue to the next one
      if (!markResult) {
        log.error({ storyID: s.id }, "unable to grab lock to archive story");
        return;
      }

      const result = await archiveStory(mongo, archive, redis, tenant.id, s.id);

      if (result?.isArchived && !result?.isArchiving) {
        log.info({ storyID: s.id }, "successfully archived story");
      } else {
        log.error({ storyID: s.id }, "unable to archive story");
      }
    });
  }
};
