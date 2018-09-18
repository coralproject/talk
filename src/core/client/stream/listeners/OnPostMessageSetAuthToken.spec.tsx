import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import { Environment, RecordSource } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { createPromisifiedStorage } from "talk-framework/lib/storage";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import { OnPostMessageSetAuthToken } from "./OnPostMessageSetAuthToken";

let relayEnvironment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  relayEnvironment = createRelayEnvironment({
    source,
  });
});

it("Sets auth token", () => {
  const token = "auth-token";
  const context: Partial<TalkContext> = {
    postMessage: {
      on: (name: string, cb: (token: string) => void) => {
        expect(name).toBe("setAuthToken");
        cb(token);
      },
    } as any,
    relayEnvironment,
    localStorage: createPromisifiedStorage(),
    clearSession: noop,
  };
  shallow(<OnPostMessageSetAuthToken context={context as any} />);
  expect(source.get(LOCAL_ID)!.authToken).toEqual(token);
});
