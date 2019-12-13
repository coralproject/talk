import { groupBy } from "lodash";
import { Db } from "mongodb";

import { Comment } from "coral-server/models/comment";
import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { MigrationError } from "../error";

export default class extends Migration {
  private async updateComment(mongo: Db, tenantID: string, comment: Comment) {
    // Get this comment's moderation actions.
    const moderationActions = await collections
      .commentModerationActions(mongo)
      .find({
        tenantID,
        commentID: comment.id,
      })
      .sort({ createdAt: 1 })
      .toArray();

    // Create the new bulk operation. We have to case this to `any` because the
    // type does not include the `arrayFilters` option now.
    const bulk = collections.comments(mongo).initializeOrderedBulkOp();

    // Group these moderation actions by their commentRevisionID.
    const groupedModerationActions = groupBy(
      moderationActions,
      "commentRevisionID"
    );

    // FIXME: (wyattjoh) determine if we should default a starting status history for those with at least one moderation action already

    for (const commentRevisionID in groupedModerationActions) {
      if (!groupedModerationActions.hasOwnProperty(commentRevisionID)) {
        continue;
      }

      // Get the actions.
      const actions = groupedModerationActions[commentRevisionID];

      // Reflow these moderation actions into a form that we can use to write it
      // back to the comment.
      bulk
        .find({ tenantID, id: comment.id, "revisions.id": commentRevisionID })
        .updateOne({
          $set: {
            "revisions.$.statusHistory": actions.map(action => ({
              id: action.id,
              status: action.status,
              moderatorID: action.moderatorID,
              createdAt: action.createdAt,
            })),
          },
        });
    }

    if (moderationActions.length === 0) {
      // If the comment does not have any moderation actions, then we can at
      // least add one related to it's current entry (set by the system).
      bulk.find({ tenantID, id: comment.id }).updateOne({
        $set: {
          "revisions.0.statusHistory": [
            {
              id: null,
              status: comment.status,
              moderatorID: null,
              createdAt: comment.createdAt,
            },
          ],
        },
      });
    }

    // Execute the bulk operation.
    await bulk.execute();
  }

  public async test(mongo: Db, tenantID: string) {
    const comments = await collections
      .comments(mongo)
      .find({ tenantID, "revisions.statusHistory": null })
      .toArray();
    if (comments.length > 0) {
      throw new MigrationError(
        tenantID,
        "found a revision without a statusHistory set",
        "comments",
        comments.map(({ id }) => id)
      );
    }
  }

  public async up(mongo: Db, tenantID: string) {
    // For each comment, find all their comment moderation actions so we can
    // reconstruct the array.
    const cursor = collections
      .comments(mongo)
      .find({
        tenantID,
        "revisions.statusHistory": null,
      })
      .sort({ createdAt: 1 });

    while (await cursor.hasNext()) {
      // Get the comment in question.
      const comment = await cursor.next();
      if (!comment) {
        continue;
      }

      // Update the comment.
      await this.updateComment(mongo, tenantID, comment);
    }
  }

  public async down(mongo: Db, tenantID: string) {
    await collections
      .comments(mongo)
      .updateMany(
        { tenantID },
        { $unset: { "revisions.$[].statusHistory": "" } }
      );
  }
}
