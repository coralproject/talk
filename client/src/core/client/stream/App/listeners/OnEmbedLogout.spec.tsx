import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import sinon from "sinon";

import { OnEmbedLogout } from "./OnEmbedLogout";

it("Listens to event and calls signOut", () => {
  const eventEmitter: any = {
    on: (eventName: string, cb: () => void) => {
      expect(eventName).toBe("embed.logout");
      cb();
    },
  };

  const signOut = sinon.stub();

  createRenderer().render(
    <OnEmbedLogout eventEmitter={eventEmitter} signOut={signOut} />
  );
  expect(signOut.calledOnce);
});
