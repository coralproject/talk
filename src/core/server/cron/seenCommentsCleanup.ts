import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { retrieveSeenCommentsForDeletion } from "coral-server/models/seenComments/seenComments";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  ScheduledJob,
  ScheduledJobCommand,
  ScheduledJobGroup,
} from "./scheduled";

interface Options {
  mongo: MongoContext;
  tenantCache: TenantCache;
  config: Config;
}

export const NAME = "Seen Comments Cleanup";

export function registerSeenCommentsCleanup(
  options: Options
): ScheduledJobGroup<Options> {
  const cronTime = options.config.get("seen_comments_cleanup_interval");
  const job = new ScheduledJob(options, {
    name: `Daily ${NAME}`,
    cronTime,
    command: cleanupSeenComments,
  });

  return { name: NAME, schedulers: [job] };
}

const cleanupSeenComments: ScheduledJobCommand<Options> = async ({
  log,
  mongo,
  tenantCache,
  config,
}) => {
  for await (const tenant of tenantCache) {
    log = log.child({ tenantID: tenant.id }, true);

    const now = new Date();
    const age = config.get("expire_seen_comments_older_than");
    const dateFilter = new Date(now.getTime() - age);

    const batchSize = 500;
    const batch = [];

    const seenComments = await retrieveSeenCommentsForDeletion(
      mongo,
      tenant.id,
      now,
      dateFilter
    );

    for (let i = 0; i < batchSize; i++) {
      if (seenComments) {
        batch.push({
          deleteOne: {
            filter: { tenantID: tenant.id, id: seenComments.id },
          },
        });
      } else {
        break;
      }
    }

    const bulkOp = mongo.seenComments().initializeUnorderedBulkOp();
    for (const item of batch) {
      bulkOp.insert(item);
    }
    await bulkOp.execute();
  }
};
