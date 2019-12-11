import { Db } from "mongodb";
import uuid from "uuid";

import { TenantResource } from "coral-server/models/tenant";
import { communities as collection } from "coral-server/services/mongodb/collections";

export interface Community extends TenantResource {
  readonly id: string;
  name: string;
  createdAt: Date;
}

export type CreateCommunityInput = Pick<Community, "name" | "tenantID">;

/**
 * create will create a new Community.
 *
 * @param mongo the MongoDB connection used to create the Community.
 * @param input the customizable parts of the Community available during creation
 */
export async function createCommunity(
  mongo: Db,
  input: CreateCommunityInput,
  now = new Date()
) {
  const community = {
    id: uuid.v4(),
    createdAt: now,
    ...input,
  };

  await collection(mongo).insertOne(community);
  return community;
}

export async function retrieveTenantCommunities(mongo: Db, tenantID: string) {
  return collection(mongo)
    .find({ tenantID })
    .toArray();
}

export async function retrieveManyCommunities(
  mongo: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = collection(mongo).find({
    id: { $in: ids },
    tenantID,
  });

  const communities = await cursor.toArray();

  return ids.map(
    id => communities.find(community => community.id === id) || null
  );
}
