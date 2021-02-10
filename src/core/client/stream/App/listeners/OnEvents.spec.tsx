import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { createSinonStub } from "coral-framework/testHelpers";

import { OnEvents } from "./OnEvents";

it("Broadcasts events to pym", () => {
  const value = { value: true };
  const eventName = "eventName";
  const eventEmitter: any = {
    onAny: (cb: (eventName: string, value: any) => void) => {
      cb(eventName, value);
    },
  };

  const pym = {
    sendMessage: createSinonStub(
      (s) => s.throws(),
      (s) =>
        s.withArgs("event", JSON.stringify({ eventName, value })).returns(null)
    ),
  };

  createRenderer().render(
    <OnEvents pym={pym as any} eventEmitter={eventEmitter} window={window} />
  );
  expect(pym.sendMessage.calledOnce).toBe(true);
});
