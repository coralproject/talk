import { v4 as uuid } from "uuid";

import { MongoContext } from "coral-server/data/context";
import { FindSeenCommentsInput } from "coral-server/graph/loaders/SeenComments";

import { TenantResource } from "../tenant";

export interface SeenComments extends TenantResource {
  readonly id: string;

  storyID: string;
  userID: string;

  lastSeenAt: Date;
  isDeleting?: boolean;

  comments: Map<string, Date>;
}

function convertMongoMapToTSMap<V>(mongoMapObj: any) {
  const entries: [string, V][] = Object.entries(mongoMapObj);
  const map = new Map<string, V>(entries);

  return map;
}

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

  if (result) {
    const model: SeenComments = {
      ...result,
      comments: result.comments
        ? convertMongoMapToTSMap<Date>(result.comments)
        : new Map<string, Date>(),
    };

    return model;
  }

  return null;
}

export async function markSeenComments(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  userID: string,
  commentIDs: string[],
  now: Date
) {
  const seenComments = await mongo.seenComments().findOne({
    tenantID,
    storyID,
    userID,
  });

  if (seenComments) {
    const comments = convertMongoMapToTSMap<Date>(seenComments.comments);
    const newIDs = commentIDs.filter((id) => !comments.has(id));
    newIDs.forEach((id) => {
      comments.set(id, now);
    });

    await mongo.seenComments().findOneAndUpdate(
      {
        tenantID,
        storyID,
        userID,
      },
      {
        $set: {
          comments,
          lastSeenAt: now,
        },
      }
    );
  } else {
    const comments = new Map<string, Date>();
    commentIDs.forEach((id) => {
      comments.set(id, now);
    });

    await mongo.seenComments().insertOne({
      id: uuid(),
      tenantID,
      storyID,
      userID,
      comments,
      lastSeenAt: now,
    });
  }
}

export async function retrieveSeenCommentsForDeletion(
  mongo: MongoContext,
  tenantID: string,
  now: Date,
  olderThan: Date
): Promise<SeenComments | null | undefined> {
  const result = await mongo.seenComments().findOneAndUpdate(
    {
      tenantID,
      isDeleting: { $in: [null, false] },
      lastSeenAt: { $lte: olderThan },
    },
    {
      $set: {
        isDeleting: true,
      },
    },
    {
      returnOriginal: false,
    }
  );

  return result.value as SeenComments;
}
