import sinon from "sinon";

import withEventEmitter from "./withEventEmitter";

it("should emit events from pym to eventEmitter", () => {
  const eventEmitterMock = {
    emit: sinon.mock().once().withArgs("eventName", "value"),
  };
  const fakePym = {
    onMessage: (type: string, callback: (raw: string) => void) => {
      if (type !== "event") {
        return;
      }
      callback(JSON.stringify({ eventName: "eventName", value: "value" }));
    },
    el: document.createElement("div"),
  };
  withEventEmitter(eventEmitterMock as any)(fakePym as any, null as any);
  eventEmitterMock.emit.verify();
});

it("should emit ready event from pym to eventEmitter", () => {
  const eventEmitterMock = {
    emit: sinon.mock().once().withArgs("ready"),
  };
  const fakePym = {
    onMessage: (type: string, callback: () => void) => {
      if (type !== "ready") {
        return;
      }
      callback();
    },
    el: document.createElement("div"),
  };
  withEventEmitter(eventEmitterMock as any)(fakePym as any, null as any);
  eventEmitterMock.emit.verify();
});
