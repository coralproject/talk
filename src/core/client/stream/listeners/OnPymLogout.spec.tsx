import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import sinon from "sinon";

import { OnPymLogout } from "./OnPymLogout";

it("Listens to event and calls signOut", () => {
  const authToken = "auth-token";
  const pym: any = {
    onMessage: (eventName: string, cb: (authToken: string) => void) => {
      expect(eventName).toBe("logout");
      cb(authToken);
    },
  };

  const signOut = sinon.stub();

  createRenderer().render(<OnPymLogout pym={pym} signOut={signOut} />);
  expect(signOut.calledOnce);
});
