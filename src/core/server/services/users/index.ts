import { Db } from "mongodb";

import { createUser, CreateUserInput } from "talk-server/models/user";

export type CreateUser = CreateUserInput;

export async function create(db: Db, tenantID: string, input: CreateUser) {
  const user = await createUser(db, tenantID, input);

  return user;
}
