import sinon from "sinon";

import withEventEmitter from "./withEventEmitter";

it("should emit special events like `ready`", () => {
  const emitStub = sinon.stub();
  const cases = [
    {
      eventName: "ready",
      streamEventName: "ready",
      value: "",
    },
  ];
  cases.forEach((c) => {
    emitStub.withArgs(c.eventName, c.value);
  });
  const embedEventEmitterMock = {
    emit: emitStub,
  };
  const fakeStreamEventEmitter = {
    onAny: (callback: (eventName: string, value: string) => void) => {
      cases.forEach((c) => {
        callback(c.streamEventName, c.value);
      });
    },
  };
  withEventEmitter(fakeStreamEventEmitter as any, embedEventEmitterMock as any);
  expect(emitStub.callCount).toBe(cases.length);
});

it("should emit viewer events", () => {
  const emitStub = sinon.stub();
  const cases = [
    {
      eventName: "eventName",
      streamEventName: "viewer.eventName",
      value: "value",
    },
  ];
  cases.forEach((c) => {
    emitStub.withArgs(c.eventName, c.value);
  });
  const embedEventEmitterMock = {
    emit: emitStub,
  };
  const fakeStreamEventEmitter = {
    onAny: (callback: (eventName: string, value: string) => void) => {
      cases.forEach((c) => {
        callback(c.streamEventName, c.value);
      });
    },
  };
  withEventEmitter(fakeStreamEventEmitter as any, embedEventEmitterMock as any);
  expect(emitStub.callCount).toBe(cases.length);
});

it("should emit deprecated events when activated", () => {
  const enableDeprecatedEvents = true;
  const emitStub = sinon.stub();
  const cases = [
    {
      eventName: "ready",
      streamEventName: "ready",
      value: "value",
    },
    {
      eventName: "mutation.eventName",
      streamEventName: "mutation.eventName",
      value: "value",
    },
    {
      eventName: "subscription.eventName",
      streamEventName: "subscription.eventName",
      value: "value",
    },
    {
      eventName: "fetch.eventName",
      streamEventName: "fetch.eventName",
      value: "value",
    },
  ];
  cases.forEach((c) => {
    emitStub.withArgs(c.eventName, c.value);
  });
  const embedEventEmitterMock = {
    emit: emitStub,
  };
  const fakeStreamEventEmitter = {
    onAny: (callback: (eventName: string, value: string) => void) => {
      cases.forEach((c) => {
        callback(c.streamEventName, c.value);
      });
    },
  };
  withEventEmitter(
    fakeStreamEventEmitter as any,
    embedEventEmitterMock as any,
    enableDeprecatedEvents
  );
  expect(emitStub.callCount).toBe(cases.length);
});

it("should not emit deprecated events when activated", () => {
  const enableDeprecatedEvents = false;
  const emitStub = sinon.stub();
  const cases = [
    {
      eventName: "ready",
      streamEventName: "ready",
      value: "value",
    },
    {
      eventName: "mutation.eventName",
      streamEventName: "mutation.eventName",
      value: "value",
    },
    {
      eventName: "subscription.eventName",
      streamEventName: "subscription.eventName",
      value: "value",
    },
    {
      eventName: "fetch.eventName",
      streamEventName: "fetch.eventName",
      value: "value",
    },
  ];
  cases.forEach((c) => {
    emitStub.withArgs(c.eventName, c.value);
  });
  const embedEventEmitterMock = {
    emit: emitStub,
  };
  const fakeStreamEventEmitter = {
    onAny: (callback: (eventName: string, value: string) => void) => {
      cases.forEach((c) => {
        callback(c.streamEventName, c.value);
      });
    },
  };
  withEventEmitter(
    fakeStreamEventEmitter as any,
    embedEventEmitterMock as any,
    enableDeprecatedEvents
  );
  expect(emitStub.callCount).toBe(1);
});

it("should not emit unknown events", () => {
  const emitStub = sinon.stub();
  const embedEventEmitterMock = {
    emit: emitStub,
  };
  const fakeStreamEventEmitter = {
    onAny: (callback: (eventName: string, value: string) => void) => {
      callback("unknown", "value");
    },
  };
  withEventEmitter(fakeStreamEventEmitter as any, embedEventEmitterMock as any);
  expect(emitStub.callCount).toBe(0);
});
