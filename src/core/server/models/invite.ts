import { Db } from "mongodb";
import uuid from "uuid";

import { Omit, Sub } from "coral-common/types";
import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";
import {
  createCollection,
  createIndexFactory,
} from "coral-server/models/helpers";
import { TenantResource } from "coral-server/models/tenant";

const collection = createCollection<Readonly<Invite>>("invites");

export async function createInviteIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // UNIQUE { email }
  await createIndex({ tenantID: 1, email: 1 }, { unique: true });
}

export interface Invite extends TenantResource {
  readonly id: string;
  email: string;
  role: GQLUSER_ROLE;
  expiresAt: Date;
  createdBy: string;
  createdAt: Date;
}

export type CreateInviteInput = Omit<
  Invite,
  "id" | "createdAt" | "tenantID" | "createdBy"
>;

export async function createInvite(
  mongo: Db,
  tenantID: string,
  { email, ...input }: CreateInviteInput,
  createdBy: string,
  now = new Date()
) {
  // Create an ID for the Invite.
  const id = uuid.v4();

  // defaults are the properties set by the application when a new Invite is
  // created.
  const defaults: Sub<Invite, CreateInviteInput> = {
    id,
    tenantID,
    createdBy,
    createdAt: now,
  };

  // Merge the defaults and the input together.
  const invite: Readonly<Invite> = {
    ...defaults,
    ...input,
    email: email.toLowerCase(),
  };

  // Insert it into the database. This may throw an error.
  await collection(mongo).insert(invite);

  return invite;
}

export async function redeemInvite(mongo: Db, tenantID: string, id: string) {
  // Try to snag the invite from the database safely.
  const result = await collection(mongo).findOneAndDelete({ id, tenantID }, {});
  if (!result.value) {
    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function redeemInviteFromEmail(
  mongo: Db,
  tenantID: string,
  email: string
) {
  // Try to snag the invite from the database safely.
  const result = await collection(mongo).findOneAndDelete(
    { email, tenantID },
    {}
  );

  return result.value || null;
}

export async function retrieveInviteFromEmail(
  mongo: Db,
  tenantID: string,
  email: string
) {
  return collection(mongo).findOne({
    tenantID,
    email: email.toLowerCase(),
  });
}

export async function retrieveInvite(mongo: Db, tenantID: string, id: string) {
  return collection(mongo).findOne({
    tenantID,
    id,
  });
}
