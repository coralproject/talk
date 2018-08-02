import { Db } from "mongodb";

import { Tenant } from "talk-server/models/tenant";
import { upsertUser, UpsertUserInput } from "talk-server/models/user";

export type UpsertUser = UpsertUserInput;

export async function upsert(db: Db, tenant: Tenant, input: UpsertUser) {
  const user = await upsertUser(db, tenant.id, input);

  return user;
}
