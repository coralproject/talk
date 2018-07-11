import { Db } from "mongodb";

import { Tenant } from "talk-server/models/tenant";
import { createUser, CreateUserInput } from "talk-server/models/user";

export type CreateUser = CreateUserInput;

export async function create(db: Db, tenant: Tenant, input: CreateUser) {
  const user = await createUser(db, tenant.id, input);

  return user;
}
