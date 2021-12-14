import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { retrieveStoriesToBeArchived } from "coral-server/models/story";
import { ArchiverQueue } from "coral-server/queue/tasks/archiver";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  ScheduledJob,
  ScheduledJobCommand,
  ScheduledJobGroup,
} from "./scheduled";

interface Options {
  mongo: MongoContext;
  tenantCache: TenantCache;
  archiverQueue: ArchiverQueue;
  config: Config;
}

export const NAME = "Fill Auto Archiving Queue";

export function registerFillArchivingQueue(
  options: Options
): ScheduledJobGroup<Options> {
  const cronSchedule = options.config.get("auto_archiving_interval");

  const job = new ScheduledJob(options, {
    name: `Scheduled ${NAME}`,
    cronTime: cronSchedule,
    command: fillArchiveQueue,
  });

  return { name: NAME, schedulers: [job] };
}

const fillArchiveQueue: ScheduledJobCommand<Options> = async ({
  log,
  mongo,
  tenantCache,
  archiverQueue,
  config,
}) => {
  const enabled = config.get("enable_auto_archiving");
  if (!enabled) {
    log.info("cancelling auto archive queuing operation as it is not enabled");
    return;
  }

  const batchSize = config.get("auto_archiving_batch_size");
  const age = config.get("auto_archive_older_than");

  for await (const tenant of tenantCache) {
    log = log.child({ tenantID: tenant.id }, true);

    log.info("beginning queuing of archive jobs into redis");

    const now = new Date();
    const dateFilter = new Date(now.getTime() - age);

    const stories = await retrieveStoriesToBeArchived(
      mongo,
      tenant.id,
      dateFilter,
      now,
      batchSize
    );

    for (const story of stories) {
      await archiverQueue.add({ tenantID: tenant.id, storyID: story.id });
    }

    log.info({ count: stories.length }, "completed queuing archive jobs");
  }
};
