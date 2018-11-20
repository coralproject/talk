import { shallow } from "enzyme";
import React from "react";

import { createSinonStub } from "talk-framework/testHelpers";

import { OnPostMessageSetAuthToken } from "./OnPostMessageSetAuthToken";

it("Listens to event and sets auth token", () => {
  const token = "auth-token";
  const postMessage: any = {
    on: (name: string, cb: (token: string) => void) => {
      expect(name).toBe("setAuthToken");
      cb(token);
    },
  };

  const setAuthToken = createSinonStub(
    s => s.throws(),
    s => s.withArgs({ authToken: token }).returns(null)
  );

  shallow(
    <OnPostMessageSetAuthToken
      postMessage={postMessage}
      setAuthToken={setAuthToken}
    />
  );
  expect(setAuthToken.calledOnce);
});
