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
    const batchSize = config.get("seen_comments_cleanup_batch_size");
    const dateFilter = new Date(now.getTime() - age);

    const internalBatchSize = 500;
    const numBatches = Math.ceil(batchSize / internalBatchSize);

    log.info({ batchSize, age }, "beginning seen comments cleanup");

    for (let i = 0; i < numBatches; i++) {
      const seenComments = await retrieveSeenCommentsForDeletion(
        mongo,
        tenant.id,
        dateFilter,
        internalBatchSize
      );

      if (seenComments.length === 0) {
        return;
      }

      log.info(
        { count: seenComments.length, subBatch: i },
        "deleting sub-batch of old seenComments records"
      );

      const deleteIDs = seenComments.map((s) => s.id);
      const bulkDelete = mongo.seenComments().initializeUnorderedBulkOp();
      bulkDelete.find({ tenantID: tenant.id, id: { $in: deleteIDs } }).remove();
      await bulkDelete.execute();
    }

    log.info("completed seen comments cleanup");
  }
};
