import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { createSinonStub } from "coral-framework/testHelpers";

import { OnPymLogin } from "./OnPymLogin";

it("Listens to event and calls setAccessToken", () => {
  const accessToken = "access-token";
  const pym: any = {
    onMessage: (eventName: string, cb: (accessToken: string) => void) => {
      expect(eventName).toBe("login");
      cb(accessToken);
    },
  };

  const setAccessToken = createSinonStub(
    (s) => s.throws(),
    (s) => s.withArgs({ accessToken, ephemeral: true }).returns(null)
  );

  createRenderer().render(
    <OnPymLogin pym={pym} setAccessToken={setAccessToken} />
  );
  expect(setAccessToken.calledOnce);
});
