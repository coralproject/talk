import { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";
import { pull } from "lodash";

/**
 * getRequestedFields returns the fields in an array that are being queried for.
 *
 * @param info query information
 */
export function getRequestedFields<T>(info: GraphQLResolveInfo) {
  return pull(Object.keys(graphqlFields<T>(info)), "__typename");
}
