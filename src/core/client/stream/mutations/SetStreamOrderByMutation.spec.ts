import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import { commit } from "./SetStreamOrderByMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

it("Sets streamOrderBy", () => {
  const orderBy = "CREATED_AT_ASC";
  commit(environment, { orderBy });
  expect(source.get(LOCAL_ID)!.streamOrderBy).toEqual(orderBy);
});
