import Queue, { Job } from "bull";
import { Db } from "mongodb";

import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import {
  Comment,
  getLatestRevision,
  retrieveAllCommentsUserConnection,
} from "coral-server/models/comment";
import { Connection } from "coral-server/models/helpers";
import Task from "coral-server/queue/Task";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";
import { rejectComment } from "coral-server/stacks";

import { GQLCOMMENT_SORT } from "coral-server/graph/schema/__generated__/types";

const JOB_NAME = "rejector";

export interface RejectorProcessorOptions {
  mongo: Db;
  redis: AugmentedRedis;
  tenantCache: TenantCache;
}

export interface RejectorData {
  authorID: string;
  moderatorID: string;
  tenantID: string;
}

function getBatch(
  mongo: Db,
  tenantID: string,
  authorID: string,
  connection?: Readonly<Connection<Readonly<Comment>>>
) {
  return retrieveAllCommentsUserConnection(mongo, tenantID, authorID, {
    orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
    first: 100,
    after: connection ? connection.pageInfo.endCursor : undefined,
  });
}

const createJobProcessor = ({
  mongo,
  redis,
  tenantCache,
}: RejectorProcessorOptions) => async (job: Job<RejectorData>) => {
  // Pull out the job data.
  const { authorID, moderatorID, tenantID } = job.data;
  const log = logger.child(
    {
      jobID: job.id,
      jobName: JOB_NAME,
      authorID,
      moderatorID,
      tenantID,
    },
    true
  );
  // Mark the start time.
  const timer = createTimer();

  log.debug("starting to reject author comments");

  // Get the tenant.
  const tenant = await tenantCache.retrieveByID(tenantID);
  if (!tenant) {
    log.error("referenced tenant was not found");
    return;
  }

  // Get the current time.
  const currentTime = new Date();

  // Find all comments written by the author that should be rejected.
  let connection = await getBatch(mongo, tenantID, authorID);
  while (connection.nodes.length > 0) {
    for (const comment of connection.nodes) {
      // Get the latest revision of the comment.
      const revision = getLatestRevision(comment);

      // Reject the comment.
      await rejectComment(
        mongo,
        redis,
        null,
        tenant,
        comment.id,
        revision.id,
        moderatorID,
        currentTime
      );
    }
    // If there was not another page, abort processing.
    if (!connection.pageInfo.hasNextPage) {
      break;
    }
    // Load the next page.
    connection = await getBatch(mongo, tenantID, authorID, connection);
  }

  // Compute the end time.
  log.debug({ took: timer() }, "rejected the author's comments");
};

export type RejectorQueue = Task<RejectorData>;

export function createRejectorTask(
  queue: Queue.QueueOptions,
  options: RejectorProcessorOptions
) {
  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
    queue,
  });
}
