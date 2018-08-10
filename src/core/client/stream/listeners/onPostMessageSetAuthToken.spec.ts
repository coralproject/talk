import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import onPostMessageSetAuthToken from "./onPostMessageSetAuthToken";

let relayEnvironment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  relayEnvironment = createRelayEnvironment({
    source,
  });
});

it("Sets auth token", () => {
  const token = "auth-token";
  const context = {
    postMessage: {
      on: (name: string, cb: (token: string) => void) => {
        expect(name).toBe("setAuthToken");
        cb(token);
      },
    },
    relayEnvironment,
  };
  onPostMessageSetAuthToken(context as any);
  expect(source.get(LOCAL_ID)!.authToken).toEqual(token);
});
