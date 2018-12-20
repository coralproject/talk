import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { createSinonStub } from "talk-framework/testHelpers";

import { OnPymLogin } from "./OnPymLogin";

it("Listens to event and calls setAuthToken", () => {
  const authToken = "auth-token";
  const pym: any = {
    onMessage: (eventName: string, cb: (authToken: string) => void) => {
      expect(eventName).toBe("login");
      cb(authToken);
    },
  };

  const setAuthToken = createSinonStub(
    s => s.throws(),
    s => s.withArgs({ authToken }).returns(null)
  );

  createRenderer().render(<OnPymLogin pym={pym} setAuthToken={setAuthToken} />);
  expect(setAuthToken.calledOnce);
});
