import Queue from "bull";

import { MongoContext } from "coral-server/data/context";
import { createTimer } from "coral-server/helpers";
import logger, { Logger } from "coral-server/logger";
import { Comment, getLatestRevision } from "coral-server/models/comment";
import { Connection } from "coral-server/models/helpers";
import { Tenant } from "coral-server/models/tenant";
import Task, { JobProcessor } from "coral-server/queue/Task";
import {
  moderate,
  retrieveAllCommentsUserConnection,
} from "coral-server/services/comments";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/schema/__generated__/types";

const JOB_NAME = "rejector";

export interface RejectorProcessorOptions {
  mongo: MongoContext;
  redis: AugmentedRedis;
  tenantCache: TenantCache;
}

export interface RejectorData {
  authorID: string;
  moderatorID: string;
  tenantID: string;
}

function getBatch(
  mongo: MongoContext,
  tenantID: string,
  authorID: string,
  connection?: Readonly<Connection<Readonly<Comment>>>,
  isArchived = false
) {
  return retrieveAllCommentsUserConnection(
    mongo,
    tenantID,
    authorID,
    {
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      first: 100,
      after: connection ? connection.pageInfo.endCursor : undefined,
    },
    isArchived
  );
}

const rejectComments = async (
  mongo: MongoContext,
  log: Logger,
  tenant: Readonly<Tenant> | null,
  authorID: string,
  moderatorID: string,
  isArchived = false
) => {
  if (!tenant) {
    log.error("referenced tenant was not found");
    return;
  }

  // Get the current time.
  const now = new Date();

  // Find all comments written by the author that should be rejected.
  let connection = await getBatch(mongo, tenant.id, authorID);
  while (connection.nodes.length > 0) {
    for (const comment of connection.nodes) {
      // Get the latest revision of the comment.
      const revision = getLatestRevision(comment);
      const input = {
        commentID: comment.id,
        commentRevisionID: revision.id,
        status: GQLCOMMENT_STATUS.REJECTED,
        moderatorID,
      };

      await moderate(mongo, tenant, input, now, isArchived);
    }
    // If there was not another page, abort processing.
    if (!connection.pageInfo.hasNextPage) {
      break;
    }
    // Load the next page.
    connection = await getBatch(mongo, tenant.id, authorID, connection);
  }
};

const createJobProcessor = ({
  mongo,
  tenantCache,
}: RejectorProcessorOptions): JobProcessor<RejectorData> => async (job) => {
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

  await rejectComments(mongo, log, tenant, authorID, moderatorID, false);
  if (mongo.archive) {
    await rejectComments(mongo, log, tenant, authorID, moderatorID, true);
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
    // We will generate a stable job ID for these rejector jobs. This ensures
    // that we cannot add multiple rejector jobs for the same user while one is
    // already in progress.
    jobIdGenerator: ({ tenantID, authorID }) => `${tenantID}:${authorID}`,
  });
}
