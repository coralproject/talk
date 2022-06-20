import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { createSinonStub } from "coral-framework/testHelpers";

import { OnEmbedLogin } from "./OnEmbedLogin";

it("Listens to event and calls setAccessToken", () => {
  const accessToken = "access-token";
  const eventEmitter: any = {
    on: (eventName: string, cb: (value: any) => void) => {
      expect(eventName).toBe("embed.login");
      cb(accessToken);
    },
  };

  const setAccessToken = createSinonStub(
    (s) => s.throws(),
    (s) => s.withArgs({ accessToken, ephemeral: true }).returns(null)
  );

  createRenderer().render(
    <OnEmbedLogin eventEmitter={eventEmitter} setAccessToken={setAccessToken} />
  );
  expect(setAccessToken.calledOnce);
});
