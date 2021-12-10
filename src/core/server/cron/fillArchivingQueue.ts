import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { retrieveStoriesToBeArchived } from "coral-server/models/story";
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

export const NAME = "Fill Auto Archiving Queue";
export const REDIS_ARCHIVING_QUEUE_KEY = "ARCHIVING_QUEUE";

export function registerFillArchivingQueue(
  options: Options
): ScheduledJobGroup<Options> {
  const cronSchedule = options.config.get("auto_archiving_queue_interval");

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
  redis,
  tenantCache,
  config,
}) => {
  const batchSize = config.get("auto_archiving_batch_size");
  const age = config.get("auto_archive_older_than");

  for await (const tenant of tenantCache) {
    log = log.child({ tenantID: tenant.id }, true);

    log.info("beginning queueing of archive jobs into redis");

    const redisKey = `${REDIS_ARCHIVING_QUEUE_KEY}:${tenant.id}`;
    const now = new Date();
    const dateFilter = new Date(now.getTime() - age);

    const stories = await retrieveStoriesToBeArchived(
      mongo,
      tenant.id,
      dateFilter,
      now,
      batchSize
    );

    const transaction = redis.multi();
    for (const story of stories) {
      transaction.sadd(redisKey, `${tenant.id}:${story.id}`);
    }
    const result = await transaction.exec();

    let errorCount = 0;
    result.forEach((r, index) => {
      let storyID = "";
      if (index >= 0 && index < stories.length) {
        storyID = stories[index].id;
      }

      r.forEach((sr: Error | null, any) => {
        const error = sr as Error;
        if (error && error.message) {
          log.warn(
            { storyID, message: error.message },
            "error adding story to redis archive queue"
          );
          errorCount++;
        }
      });
    });

    log.info(
      { attempted: stories.length, errored: errorCount },
      "completed queueing archive jobs into redis"
    );
  }
};
