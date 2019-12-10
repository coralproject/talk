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
 * create will create a new Site.
 *
 * @param mongo the MongoDB connection used to create the Site.
 * @param input the customizable parts of the Site available during creation
 */
export async function createSite(
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
