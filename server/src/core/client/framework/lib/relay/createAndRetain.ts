import {
  createOperationDescriptor,
  Environment,
  getRequest,
  RecordProxy,
  RecordSourceProxy,
} from "relay-runtime";

/**
 * Creates a Record and retain it forever. Useful for local state.
 * This means that the garbage collector will not remove the record
 * on the next run.
 *
 * See https://github.com/facebook/relay/issues/1656#issuecomment-380519761
 */
export default function createAndRetain(
  environment: Environment,
  source: RecordSourceProxy,
  id: string,
  type: string
): RecordProxy {
  // TODO: (cvle) This part is still hacky.
  // Waiting for a solution to https://github.com/facebook/relay/issues/2997#issuecomment-604218660.
  const query = {
    kind: "Request",
    operation: {
      kind: "Operation",
      argumentDefinitions: [],
      selections: [],
    },
    params: {
      id,
      operationKind: "query",
    },
  } as any;
  // TODO: (cvle) Third argument missing in type, remove `as any` when added.
  const operation = (createOperationDescriptor as any)(
    getRequest(query),
    {},
    id
  );
  const result = source.create(id, type);
  environment.retain(operation);
  return result;
}
