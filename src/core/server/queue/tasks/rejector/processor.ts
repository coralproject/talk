import { inject, singleton } from "tsyringe";

import { createTimer } from "coral-server/helpers";
import {
  Comment,
  getLatestRevision,
  retrieveAllCommentsUserConnection,
} from "coral-server/models/comment";
import { Connection } from "coral-server/models/helpers";
import {
  Processor,
  ProcessorHandler,
} from "coral-server/queue/tasks/processor";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import { Redis, REDIS } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";
import { rejectComment } from "coral-server/stacks";

import { GQLCOMMENT_SORT } from "coral-server/graph/schema/__generated__/types";

export const JOB_NAME = "rejector";

export interface RejectorData {
  authorID: string;
  moderatorID: string;
  tenantID: string;
}

@singleton()
export class RejectorQueueProcessor implements Processor<RejectorData> {
  constructor(
    @inject(MONGO) private readonly mongo: Mongo,
    @inject(REDIS) private readonly redis: Redis,
    private readonly tenantCache: TenantCache
  ) {}

  private getBatch(
    tenantID: string,
    authorID: string,
    connection?: Readonly<Connection<Readonly<Comment>>>
  ) {
    return retrieveAllCommentsUserConnection(this.mongo, tenantID, authorID, {
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      first: 100,
      after: connection ? connection.pageInfo.endCursor : undefined,
    });
  }

  public process: ProcessorHandler<RejectorData> = async (logger, job) => {
    // Pull out the job data.
    const { authorID, moderatorID, tenantID } = job.data;

    // Mark the start time.
    const timer = createTimer();

    logger.debug(
      {
        authorID,
        moderatorID,
      },
      "starting to reject author comments"
    );

    // Get the tenant.
    const tenant = await this.tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      logger.error("referenced tenant was not found");
      return;
    }

    // Get the current time.
    const currentTime = new Date();

    // Find all comments written by the author that should be rejected.
    let connection = await this.getBatch(tenantID, authorID);
    while (connection.nodes.length > 0) {
      for (const comment of connection.nodes) {
        // Get the latest revision of the comment.
        const revision = getLatestRevision(comment);

        // Reject the comment.
        await rejectComment(
          this.mongo,
          this.redis,
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
      connection = await this.getBatch(tenantID, authorID, connection);
    }

    // Compute the end time.
    logger.debug({ took: timer() }, "rejected the author's comments");
  };
}
