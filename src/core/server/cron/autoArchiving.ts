import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import {
  markStoryForArchiving,
  retrieveStoriesToBeArchived,
} from "coral-server/models/story";
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
      mongo.main,
      tenant.id,
      dateFilter,
      batchSize
    );

    log.info({ count: stories.length }, "archiving stories");

    for (const story of stories) {
      log.info({ storyID: story.id }, "archiving story");

      const markResult = await markStoryForArchiving(
        mongo.main,
        tenant.id,
        story.id,
        now
      );

      // If we have the document, we have the archiving lock and
      // can proceed to archive
      if (markResult) {
        const result = await archiveStory(
          mongo,
          redis,
          tenant.id,
          story.id,
          log
        );

        if (result?.isArchived && !result?.isArchiving) {
          log.info({ storyID: story.id }, "successfully archived story");
        } else {
          log.error({ storyID: story.id }, "unable to archive story");
        }
      }
      // Cannot proceed if we can't lock the story for archiving,
      // log an error for this archive op and continue on to the next
      // story in the batch
      else {
        log.error(
          { storyID: story.id },
          "unable to grab lock to archive story"
        );
      }
    }
  }
};
