import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import { commit } from "./SetRedirectPathMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

it("Sets redirectPath", () => {
  commit(environment, { path: "/path" });
  expect(source.get(LOCAL_ID)!.redirectPath).toEqual("/path");
});
