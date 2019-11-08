import { Db } from "mongodb";
import uuid from "uuid";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { Omit } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import { PartialSettings } from "coral-server/models/settings";
import { sites as collection } from "coral-server/services/mongodb/collections";

import { GQLSite } from "coral-server/graph/tenant/schema/__generated__/types";

export interface Site extends GQLSite {
  settings: PartialSettings;
  communityID: string;
  tenantID: string;
  locale: LanguageCode;
}

export type CreateSiteInput = Pick<
  Site,
  "name" | "contactEmail" | "url" | "locale" | "allowedDomains" | "domain"
>;

export async function createSite(
  mongo: Db,
  tenantID: string,
  communityID: string,
  input: CreateSiteInput,
  now = new Date()
) {
  const site: Readonly<Site> = {
    id: uuid.v4(),
    createdAt: now,
    tenantID,
    communityID,
    settings: {},
    ...input,
  };

  await collection(mongo).insert(site);
  return site;
}

export type UpdateSiteInput = Omit<
  Partial<Site>,
  "createdAt" | "id" | "locale"
>;

export async function updateSite(
  mongo: Db,
  tenantID: string,
  id: string,
  update: UpdateSiteInput
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    { $set: dotize(update, { embedArrays: true }) },
    { returnOriginal: false }
  );

  return result.value || null;
}

export async function retrieveSite(mongo: Db, id: string) {
  return collection(mongo).findOne({ id });
}

export async function retrieveCommunitySites(mongo: Db, communityID: string) {
  return collection(mongo)
    .find({ communityID })
    .toArray();
}
