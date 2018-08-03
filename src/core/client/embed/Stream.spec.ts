import sinon from "sinon";

import { createStreamInterface } from "./Stream";

it("should call eventEmitter.on", () => {
  const control = {};
  const cb = () => "";
  const eventEmitter = {
    on: sinon
      .mock()
      .once()
      .withArgs("eventName", cb),
  };
  const stream = createStreamInterface(control as any, eventEmitter as any);
  stream.on("eventName", cb);
  eventEmitter.on.verify();
});

it("should call eventEmitter.off", () => {
  const control = {};
  const cb = () => "";
  const eventEmitter = {
    off: sinon
      .mock()
      .once()
      .withArgs("eventName", cb),
  };
  const stream = createStreamInterface(control as any, eventEmitter as any);
  stream.off("eventName", cb);
  eventEmitter.off.verify();
});

it("should call control.login", () => {
  const control = {
    sendMessage: sinon
      .mock()
      .once()
      .withArgs("login", "token"),
  };
  const eventEmitter = {};
  const stream = createStreamInterface(control as any, eventEmitter as any);
  stream.login("token");
  control.sendMessage.verify();
});

it("should call control.logout", () => {
  const control = {
    sendMessage: sinon
      .mock()
      .once()
      .withArgs("logout"),
  };
  const eventEmitter = {};
  const stream = createStreamInterface(control as any, eventEmitter as any);
  stream.logout();
  control.sendMessage.verify();
});

it("should call control.remove", () => {
  const control = {
    remove: sinon
      .mock()
      .once()
      .withArgs(),
  };
  const eventEmitter = {};
  const stream = createStreamInterface(control as any, eventEmitter as any);
  stream.remove();
  control.remove.verify();
});
