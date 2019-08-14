import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { createSinonStub } from "coral-framework/testHelpers";

import { noop } from "lodash";
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

  createRenderer().render(
    <OnEvents pym={pym as any} eventEmitter={eventEmitter} />
  );
  expect(pym.sendMessage.calledOnce).toBe(true);
});

it("emits event aliases", () => {
  const eventEmitter: any = {
    emit: createSinonStub(
      s => s.throws(),
      s => s.withArgs("loginPrompt").returns(null)
    ),
    onAny: (cb: (eventName: string, value: any) => void) => {
      cb("mutation.showAuthPopup", { view: "SIGN_IN" });
    },
  };

  const pym = {
    sendMessage: noop,
  };

  createRenderer().render(
    <OnEvents pym={pym as any} eventEmitter={eventEmitter} />
  );
  expect(eventEmitter.emit.calledOnce).toBe(true);
});
