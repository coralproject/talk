import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";

/**
 * Creates a Record and retain it forever.
 * This means that the garbage collector will
 * not remove the record on the next run.
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
    node: { selections: [] },
    variables: {},
  });
  return result;
}
