import { Db } from "mongodb";

import {
  CommentStatusCounts,
  createEmptyCommentStatusCounts,
} from "coral-server/models/comment";
import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

const BATCH_SIZE = 500;

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    const cursor = collections
      .comments<{
        _id: string;
        statuses: { status: GQLCOMMENT_STATUS; sum: number }[];
      }>(mongo)
      .aggregate([
        // Find all comments written by this Tenant.
        {
          $match: { tenantID },
        },
        // Group each comment into it's authorID and status.
        {
          $group: {
            _id: {
              authorID: "$authorID",
              status: "$status",
            },
            sum: { $sum: 1 },
          },
        },
        // Group the documents from the previous stage into a count of each
        // author's status counts.
        {
          $group: {
            _id: "$_id.authorID",
            statuses: {
              $push: {
                status: "$_id.status",
                sum: "$sum",
              },
            },
          },
        },
      ]);

    let updates: {
      updateOne: {
        filter: { tenantID: string; id: string };
        update: { $set: { commentCounts: { status: CommentStatusCounts } } };
      };
    }[] = [];

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (!doc) {
        break;
      }

      // Reconstruct the comment status counts.
      const statuses = createEmptyCommentStatusCounts();
      for (const { status, sum } of doc.statuses) {
        statuses[status] += sum;
      }

      // Push the update.
      updates.push({
        updateOne: {
          filter: {
            tenantID,
            id: doc._id,
          },
          update: {
            $set: {
              commentCounts: {
                status: statuses,
              },
            },
          },
        },
      });

      // Process updates if we are at the batch size.
      if (updates.length >= BATCH_SIZE) {
        await collections.users(mongo).bulkWrite(updates);
        updates = [];
      }
    }

    // Process any missed updates.
    if (updates.length > 0) {
      await collections.users(mongo).bulkWrite(updates);
      updates = [];
    }
  }
}
