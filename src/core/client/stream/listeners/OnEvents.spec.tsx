import { shallow } from "enzyme";
import React from "react";

import { createSinonStub } from "talk-framework/testHelpers";

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
      s => s.throws(),
      s =>
        s.withArgs("event", JSON.stringify({ eventName, value })).returns(null)
    ),
  };

  shallow(<OnEvents pym={pym as any} eventEmitter={eventEmitter} />);
  expect(pym.sendMessage.calledOnce).toBe(true);
});
