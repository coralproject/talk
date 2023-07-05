import { GraphQLTaggedNode } from "react-relay";
import {
  createOperationDescriptor,
  Disposable,
  Environment,
  getRequest,
} from "relay-runtime";

/**
 * Retain query in Relay Store until disposal.
 * This will prevent garbage collection.
 */
function retainQuery<T extends { response: any; variables: any }>(
  environment: Environment,
  query: GraphQLTaggedNode,
  variables: T["variables"] = {}
): Disposable {
  const request = getRequest(query);
  const operation = createOperationDescriptor(request, variables);
  return environment.retain(operation);
}

export default retainQuery;
