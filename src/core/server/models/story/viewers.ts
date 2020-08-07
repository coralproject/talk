import { DateTime } from "luxon";
import { Db } from "mongodb";

import { storyViewer as collection } from "coral-server/services/mongodb/collections";

import { TenantResource } from "../tenant";

export interface StoryViewer extends TenantResource {
  storyID: string;
  siteID: string;
  clientID: string;
  lastInteractedAt: Date;
}

interface CreateStoryViewer {
  storyID: string;
  siteID: string;
  tenantID: string;
  clientID: string;
}

export async function createStoryViewer(
  mongo: Db,
  { clientID, ...input }: CreateStoryViewer,
  now: Date
) {
  await collection(mongo).findOneAndUpdate(
    { clientID },
    {
      $set: {
        ...input,
        lastInteractedAt: now,
      },
    },
    {
      upsert: true,
    }
  );
}

export async function removeStoryViewer(mongo: Db, clientID: string) {
  await collection(mongo).deleteOne({ clientID });
}

export async function touchStoryViewer(mongo: Db, clientID: string, now: Date) {
  await collection(mongo).updateOne(
    { clientID },
    { $set: { lastInteractedAt: now } }
  );
}

export async function countStoryViewers(
  mongo: Db,
  tenantID: string,
  siteID: string,
  storyID: string,
  timeout: number,
  now: Date
) {
  const start = DateTime.fromJSDate(now).minus({ second: timeout }).toJSDate();

  const results = await collection<{ count: number }>(mongo)
    .aggregate([
      {
        $match: {
          tenantID,
          siteID,
          storyID,
          lastInteractedAt: { $gt: start, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  if (results.length === 0) {
    return 0;
  }

  return results[0].count;
}
