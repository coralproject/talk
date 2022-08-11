import { v4 as uuid } from "uuid";

import { dotize } from "coral-common/utils/dotize";
import { MongoContext } from "coral-server/data/context";
import { FindSeenCommentsInput } from "coral-server/graph/loaders/SeenComments";
import SeenCommentsCollection from "coral-server/graph/seenCommentsCollection";

import { TenantResource } from "../tenant";

/**
 * SeenComments are a list of all the comments a user has seen on a story. This
 * is why it is ID'ed by storyID and userID. The lookup for whether a comment is
 * seen or not is determined by whether it is in the list of `comments`. To
 * determine how fresh the seen data is, each commentID is mapped to a date and
 * there is a `lastSeenAt` that is the most recent update time in the entire
 * collection of comment's mapped dates.
 */
export interface SeenComments extends TenantResource {
  readonly id: string;

  storyID: string;
  userID: string;
  tenantID: string;

  /**
   * the last time this lookup table was updated with a seen comment ID.
   */
  lastSeenAt: Date;

  /**
   * the lookup of commentID's this user has seen on this story mapped to the
   * date they were seen at.
   */
  comments: Record<string, Date>;
}

/**
 * Find the lookup table for seen comments tied to a user for a specific story.
 *
 * @param mongo is the mongo context where the seen comments lookups are stored.
 * @param tenantID is the tenant ID we are currently loading a story/user for.
 * @param findSeenCommentsInput is the storyID and userID to find seen comments list for.
 * @returns the lookup table of seen comment id's for this storyID/userID pair.
 * Returns null if it does not exist (no comments seen on this story for this
 * user).
 */
export async function findSeenComments(
  mongo: MongoContext,
  tenantID: string,
  { storyID, userID }: FindSeenCommentsInput
): Promise<SeenComments | null> {
  const result = await mongo.seenComments().findOne({
    tenantID,
    storyID,
    userID,
  });

  return result ?? null;
}

export function reduceCommentIDs(commentIDs: string[], now: Date) {
  const comments = commentIDs.reduce<Record<string, Date>>((acc, commentID) => {
    acc[commentID] = now;
    return acc;
  }, {});

  return comments;
}

/**
 * Marks multiple comments as seen for a user.
 *
 * @param mongo is the mongo context used to mark the comments as seen.
 * @param tenantID is the tenant to filter by for this marking operation.
 * @param storyID is the story ID we filter by for this marking operation.
 * @param userID is the user ID for which we want to mark the comments for.
 * @param commentIDs are the comments we want to mark as as seen in the seen
 * comments lookup table.
 * @param now is the current time.
 */
export async function markSeenComments(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  userID: string,
  commentIDs: string[],
  now: Date,
  markAllAsSeen?: boolean
) {
  let comments;
  if (markAllAsSeen) {
    const markAllCommentIDs = (
      await mongo
        .comments()
        .find({ tenantID, storyID }, { projection: { id: 1 } })
        .toArray()
    ).map((comment) => comment.id);
    comments = reduceCommentIDs(markAllCommentIDs, now);
  } else {
    comments = reduceCommentIDs(commentIDs, now);
  }

  const result = await mongo.seenComments().findOneAndUpdate(
    {
      storyID,
      tenantID,
      userID,
    },
    {
      $setOnInsert: {
        id: uuid(),
        storyID,
        userID,
        tenantID,
      },
      $set: {
        lastSeenAt: now,
        ...dotize({ comments }),
      },
    },
    { upsert: true }
  );

  return result.value;
}

export async function markSeenCommentsBulk(
  mongo: MongoContext,
  tenantID: string,
  seenComments: SeenCommentsCollection,
  now: Date
) {
  const operations: any[] = [];

  const keys = seenComments.keys();
  for (const { userID, storyID } of keys) {
    const commentIDs = seenComments.idsForStory(userID, storyID);
    const comments = reduceCommentIDs(commentIDs, now);

    operations.push({
      updateOne: {
        filter: { tenantID, storyID, userID },
        update: {
          $setOnInsert: {
            id: uuid(),
            storyID,
            userID,
            tenantID,
          },
          $set: {
            lastSeenAt: now,
            ...dotize({ comments }),
          },
        },
        upsert: true,
      },
    });
  }

  if (operations.length === 0) {
    return 0;
  }

  const result = await mongo
    .seenComments()
    .bulkWrite(operations, { ordered: false });

  return (
    (result.insertedCount ?? 0) +
    (result.modifiedCount ?? 0) +
    (result.upsertedCount ?? 0)
  );
}
