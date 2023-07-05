import { v4 as uuid } from "uuid";

import { Sub } from "coral-common/types";
import { MongoContext } from "coral-server/data/context";
import { TenantResource } from "coral-server/models/tenant";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

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
  mongo: MongoContext,
  tenantID: string,
  { email, ...input }: CreateInviteInput,
  createdBy: string,
  now = new Date()
) {
  // Create an ID for the Invite.
  const id = uuid();

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
  await mongo.invites().insertOne(invite);

  return invite;
}

export async function redeemInvite(
  mongo: MongoContext,
  tenantID: string,
  id: string
) {
  // Try to snag the invite from the database safely.
  const result = await mongo.invites().findOneAndDelete({ id, tenantID }, {});
  if (!result.value) {
    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function redeemInviteFromEmail(
  mongo: MongoContext,
  tenantID: string,
  email: string
) {
  // Try to snag the invite from the database safely.
  const result = await mongo
    .invites()
    .findOneAndDelete({ email, tenantID }, {});

  return result.value || null;
}

export async function retrieveInviteFromEmail(
  mongo: MongoContext,
  tenantID: string,
  email: string
) {
  return mongo.invites().findOne({
    tenantID,
    email: email.toLowerCase(),
  });
}

export async function retrieveInvite(
  mongo: MongoContext,
  tenantID: string,
  id: string
) {
  return mongo.invites().findOne({
    tenantID,
    id,
  });
}
