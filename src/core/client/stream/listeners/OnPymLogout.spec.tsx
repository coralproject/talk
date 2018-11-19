import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import { OnPymLogout } from "./OnPymLogout";

it("Sets auth token", () => {
  const authToken = "auth-token";
  const pym: any = {
    onMessage: (eventName: string, cb: (authToken: string) => void) => {
      expect(eventName).toBe("logout");
      cb(authToken);
    },
  };

  const signOut = sinon.stub();

  shallow(<OnPymLogout pym={pym} signOut={signOut} />);
  expect(signOut.calledOnce);
});
