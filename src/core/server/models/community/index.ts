import { Db } from "mongodb";
import uuid from "uuid";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { DeepPartial, Omit } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import { PartialSettings } from "coral-server/models/settings";
import { communities as collection } from "coral-server/services/mongodb/collections";

import { GQLCommunity } from "coral-server/graph/tenant/schema/__generated__/types";

export interface Community extends GQLCommunity {
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
  DeepPartial<Community>,
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
    { $set: dotize(update, { embedArrays: true }) },
    { returnOriginal: false }
  );

  return result.value || null;
}

export async function retrieveCommunity(mongo: Db, id: string) {
  return collection(mongo).findOne({ id });
}

export async function retrieveTenantCommunities(mongo: Db, tenantID: string) {
  return collection(mongo)
    .find({ tenantID })
    .toArray();
}
