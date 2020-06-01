import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { createSinonStub } from "coral-framework/testHelpers";

import { OnPostMessageSetAccessToken } from "./OnPostMessageSetAccessToken";

it("Listens to event and sets access token", () => {
  const token = "access-token";
  const postMessage: any = {
    on: (name: string, cb: (token: string) => void) => {
      expect(name).toBe("setAccessToken");
      cb(token);
    },
  };

  let emittedEventName = "";
  const eventEmitter: any = {
    emit: (name: string, values: any) => {
      emittedEventName = name;
    },
  };

  const setAccessToken = createSinonStub(
    (s) => s.throws(),
    (s) => s.withArgs({ accessToken: token }).returns(null)
  );

  createRenderer().render(
    <OnPostMessageSetAccessToken
      eventEmitter={eventEmitter}
      postMessage={postMessage}
      setAccessToken={setAccessToken}
    />
  );
  expect(setAccessToken.calledOnce);
  expect(emittedEventName).toBe("signedIn");
});
