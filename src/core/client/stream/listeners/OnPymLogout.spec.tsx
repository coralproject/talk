import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import sinon from "sinon";

import { OnPymLogout } from "./OnPymLogout";

it("Listens to event and calls signOut", () => {
  const accessToken = "access-token";
  const pym: any = {
    onMessage: (eventName: string, cb: (accessToken: string) => void) => {
      expect(eventName).toBe("logout");
      cb(accessToken);
    },
  };

  const signOut = sinon.stub();

  createRenderer().render(<OnPymLogout pym={pym} signOut={signOut} />);
  expect(signOut.calledOnce);
});
