import sinon from "sinon";

import withEventEmitter from "./withEventEmitter";

it("should emit events from pym to eventEmitter", () => {
  const eventEmitterMock = {
    emit: sinon
      .mock()
      .once()
      .withArgs("eventName", "value"),
  };
  const fakePym = {
    onMessage: (type: string, callback: (raw: string) => void) => {
      expect(type).toBe("event");
      callback(JSON.stringify({ eventName: "eventName", value: "value" }));
    },
    el: document.createElement("div"),
  };
  withEventEmitter(eventEmitterMock as any)(fakePym as any);
  eventEmitterMock.emit.verify();
});
