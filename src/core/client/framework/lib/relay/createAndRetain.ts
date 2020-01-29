import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";

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
  const result = source.create(id, type);
  environment.retain({
    dataID: id,
    // TODO: Do we still need this retain hack?
    node: { selections: [] } as any,
    variables: {},
  });
  return result;
}
