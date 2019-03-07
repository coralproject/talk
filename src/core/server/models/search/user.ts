import { Elasticsearch } from "talk-server/services/elasticsearch";

import { Profile, User } from "../user";
import { deleteDocument, indexDocument } from "./helpers";

/**
 * IndexedUser is a version of the User that is indexed in Elasticsearch.
 */
export type IndexedUser = Pick<
  User,
  "tenantID" | "id" | "username" | "email" | "role" | "createdAt"
> & {
  profiles: Array<Pick<Profile, "id" | "type">>;
};

/**
 * toIndexedUser will convert a User into an IndexedUser.
 *
 * @param user the user to convert into an IndexedUser.
 */
export function buildIndexedUserBody(user: User): IndexedUser {
  return {
    tenantID: user.tenantID,
    id: user.id,
    username: user.username,
    email: user.email,
    profiles: user.profiles.map(({ type, id }) => ({ type, id })),
    role: user.role,
    createdAt: user.createdAt,
  };
}

/**
 * indexUser will index a given User in their IndexedUser form.
 *
 * @param elasticsearch the Elasticsearch client to use for indexing the User.
 * @param user the User to index.
 */
export const indexUser = (elasticsearch: Elasticsearch, user: User) =>
  indexDocument(elasticsearch, buildIndexedUserBody(user), "users");

export const deleteIndexedUser = (elasticsearch: Elasticsearch, id: string) =>
  deleteDocument(elasticsearch, id, "users");
