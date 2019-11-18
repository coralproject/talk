import { Db } from "mongodb";
import uuid from "uuid";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { DeepPartial, Omit } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import { PartialSettings } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import { communities as collection } from "coral-server/services/mongodb/collections";

import { GQLCommunity } from "coral-server/graph/tenant/schema/__generated__/types";

import { consolidate } from "../helpers/settings";

export interface Community
  extends Omit<GQLCommunity, "consolidatedSettings" | "sites"> {
  settings: PartialSettings;
  tenantID: string;
  locale: LanguageCode;
}

export type CreateCommunityInput = Pick<
  Community,
  "name" | "contactEmail" | "url" | "locale"
>;

export async function createCommunity(
  mongo: Db,
  tenantID: string,
  input: CreateCommunityInput,
  now = new Date()
) {
  const community: Readonly<Community> = {
    id: uuid.v4(),
    createdAt: now,
    tenantID,
    settings: {},
    ...input,
  };

  await collection(mongo).insert(community);
  return community;
}

export type UpdateCommunityInput = Omit<
  Partial<Community>,
  "createdAt" | "id" | "locale"
>;

export async function updateCommunity(
  mongo: Db,
  tenantID: string,
  id: string,
  update: UpdateCommunityInput
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    { $set: dotize(update) },
    { returnOriginal: false }
  );

  return result.value || null;
}

export type UpdateCommunitySettingsInput = DeepPartial<PartialSettings>;

export async function updateCommunitySettings(
  mongo: Db,
  tenantID: string,
  id: string,
  update: UpdateCommunitySettingsInput
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    {
      $set: dotize({ settings: update }),
    },
    { returnOriginal: false }
  );

  return result.value || null;
}

export async function retrieveCommunity(
  mongo: Db,
  tenantID: string,
  id: string
) {
  return collection(mongo).findOne({ id, tenantID });
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

export async function retrieveTenantCommunities(mongo: Db, tenantID: string) {
  return collection(mongo)
    .find({ tenantID })
    .toArray();
}

export function retrieveConsolidatedSettings(
  tenant: Tenant,
  community: Community | null
) {
  if (!community) {
    throw new Error("community not found");
  }
  return consolidate(tenant, community);
}
