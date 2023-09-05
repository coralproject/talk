import { GraphQLTaggedNode } from "react-relay";
import {
  createOperationDescriptor,
  Environment,
  getRequest,
} from "relay-runtime";

/**
 * Lookup data that is stored in Relay store.
 *
 * Attention: This does not cause a network request
 * and does not prevent relay garbage collection.
 * This will usually cause data dependencies to other
 * components if you look into non-local-state,
 * make sure to make a comment about that.
 *
 * To prevent garbage collection look into `retainQuery`.
 *
 * Only use, if you know what you do!
 */
function lookupQuery<T extends { response: any; variables: any }>(
  environment: Environment,
  query: GraphQLTaggedNode,
  variables: T["variables"] = {}
): T["response"] {
  const request = getRequest(query);
  const operation = createOperationDescriptor(request, variables);
  return environment.lookup(operation.fragment).data as any as T["response"];
}

export default lookupQuery;
