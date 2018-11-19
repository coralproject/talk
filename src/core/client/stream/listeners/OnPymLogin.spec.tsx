import { shallow } from "enzyme";
import React from "react";

import { createSinonStub } from "talk-framework/testHelpers";

import { OnPymLogin } from "./OnPymLogin";

it("Sets auth token", () => {
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

  shallow(<OnPymLogin pym={pym} setAuthToken={setAuthToken} />);
  expect(setAuthToken.calledOnce);
});
