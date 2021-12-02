import { EventEmitter2 } from "eventemitter2";
import { omit } from "lodash";
import sinon from "sinon";
import timekeeper from "timekeeper";

import { FrameControlConfig, FrameControlFactory } from "./FrameControl";
import { StreamEmbed, StreamEmbedConfig } from "./StreamEmbedLegacy";

function createPymFrameControlStub() {
  return {
    rendered: false,
    render: sinon.stub(),
    sendMessage: sinon.stub(),
    remove: sinon.stub(),
  };
}

beforeEach(() => {
  timekeeper.freeze(new Date(1589310827300));
  document.body.innerHTML = `<div id="container-id" />`;
});

afterEach(() => {
  timekeeper.reset();
});

it("should throw when calling remove but was not rendered", () => {
  const config: StreamEmbedConfig = {
    title: "StreamEmbed",
    eventEmitter: new EventEmitter2(),
    id: "container-id",
    rootURL: "http://localhost/",
  };
  const streamEmbed = new StreamEmbed(config);
  expect(() => streamEmbed.remove()).toThrow();
});

it("should return rendered", () => {
  const config: StreamEmbedConfig = {
    title: "StreamEmbed",
    eventEmitter: new EventEmitter2(),
    id: "container-id",
    rootURL: "http://localhost/",
  };
  const pymControl = createPymFrameControlStub();
  const fakeFactory: FrameControlFactory = () => pymControl;
  const streamEmbed = new StreamEmbed(config, fakeFactory);
  expect(streamEmbed.rendered).toBe(false);
  streamEmbed.render();
  expect(pymControl.render.called).toBe(true);
  pymControl.rendered = true;
  expect(streamEmbed.rendered).toBe(true);
  streamEmbed.remove();
  expect(pymControl.remove.called).toBe(true);
  pymControl.rendered = false;
  expect(streamEmbed.rendered).toBe(false);
});

it("should relay events methods to event emitter", () => {
  const config: StreamEmbedConfig = {
    title: "StreamEmbed",
    eventEmitter: new EventEmitter2(),
    id: "container-id",
    rootURL: "http://localhost/",
  };
  // eslint-disable-next-line:no-empty
  const callback = () => {};
  const fakeFactory: any = () => ({});
  const emitterMock = sinon.mock(config.eventEmitter);
  emitterMock.expects("on").withArgs("event", callback).once();
  emitterMock.expects("off").withArgs("event", callback).once();
  const streamEmbed = new StreamEmbed(config, fakeFactory);
  streamEmbed.on("event", callback);
  streamEmbed.off("event", callback);
});

describe("should send login message to PymControl", () => {
  let pymControlMock: ReturnType<typeof createPymFrameControlStub>;
  let streamEmbed: StreamEmbed;
  let eventEmitter: EventEmitter2;

  beforeEach(() => {
    eventEmitter = new EventEmitter2();
    const config: StreamEmbedConfig = {
      title: "StreamEmbed",
      eventEmitter,
      id: "container-id",
      rootURL: "http://localhost/",
    };
    pymControlMock = createPymFrameControlStub();
    const fakeFactory: FrameControlFactory = () => pymControlMock;
    streamEmbed = new StreamEmbed(config, fakeFactory);
  });

  it("send login immediately when already ready", () => {
    streamEmbed.render();
    eventEmitter.emit("ready");
    streamEmbed.login("token");
    expect(pymControlMock.sendMessage.calledWith("login", "token")).toBe(true);
  });

  it("defer login until ready", () => {
    streamEmbed.login("token");
    streamEmbed.render();
    eventEmitter.emit("ready");
    expect(pymControlMock.sendMessage.calledWith("login", "token")).toBe(true);
  });

  it("do not call login when not ready", () => {
    streamEmbed.login("token");
    streamEmbed.render();
    expect(pymControlMock.sendMessage.calledWith("login", "token")).toBe(false);
  });
});

describe("should send logout message to PymControl", () => {
  let pymControlMock: ReturnType<typeof createPymFrameControlStub>;
  let streamEmbed: StreamEmbed;
  let eventEmitter: EventEmitter2;

  beforeEach(() => {
    eventEmitter = new EventEmitter2();
    const config: StreamEmbedConfig = {
      title: "StreamEmbed",
      eventEmitter,
      id: "container-id",
      rootURL: "http://localhost/",
    };
    pymControlMock = createPymFrameControlStub();
    const fakeFactory: FrameControlFactory = () => pymControlMock;
    streamEmbed = new StreamEmbed(config, fakeFactory);
  });

  it("send logout immediately when already ready", () => {
    streamEmbed.render();
    eventEmitter.emit("ready");
    streamEmbed.logout();
    expect(pymControlMock.sendMessage.calledWith("logout")).toBe(true);
  });

  it("defer logout until ready", () => {
    streamEmbed.logout();
    streamEmbed.render();
    eventEmitter.emit("ready");
    expect(pymControlMock.sendMessage.calledWith("logout")).toBe(true);
  });

  it("do not call logout when not ready", () => {
    streamEmbed.logout();
    streamEmbed.render();
    expect(pymControlMock.sendMessage.calledWith("logout")).toBe(false);
  });
});

it("should pass default values to pymControl", () => {
  const config: StreamEmbedConfig = {
    title: "StreamEmbed",
    eventEmitter: new EventEmitter2(),
    id: "container-id",
    rootURL: "http://localhost/",
  };
  let pymControlConfig: FrameControlConfig | null = null;
  const pymControl = createPymFrameControlStub();
  const fakeFactory: FrameControlFactory = (cfg: FrameControlConfig) => {
    pymControlConfig = cfg;
    return pymControl;
  };
  const streamEmbed = new StreamEmbed(config, fakeFactory);
  streamEmbed.render();
  expect(omit(pymControlConfig, "decorators")).toMatchSnapshot();
});

it("should pass correct values to pymControl", () => {
  const config: StreamEmbedConfig = {
    title: "StreamEmbed",
    eventEmitter: new EventEmitter2(),
    id: "container-id",
    rootURL: "http://localhost/",
    commentID: "comment-id",
    storyID: "story-id",
    storyURL: "story-url",
  };
  let pymControlConfig: FrameControlConfig | null = null;
  const pymControl = createPymFrameControlStub();
  const fakeFactory: FrameControlFactory = (cfg: FrameControlConfig) => {
    pymControlConfig = cfg;
    return pymControl;
  };
  const streamEmbed = new StreamEmbed(config, fakeFactory);
  streamEmbed.render();
  expect(omit(pymControlConfig, "decorators")).toMatchSnapshot();
});

it("should emit showPermalink", () => {
  jest.useFakeTimers();
  const config: StreamEmbedConfig = {
    title: "StreamEmbed",
    eventEmitter: new EventEmitter2(),
    id: "container-id",
    rootURL: "http://localhost/",
    commentID: "comment-id",
  };
  const pymControl = createPymFrameControlStub();
  const fakeFactory: FrameControlFactory = () => pymControl;
  const emitterMock = sinon.mock(config.eventEmitter);
  emitterMock.expects("emit").withArgs("showPermalink").once();
  // eslint-disable-next-line:no-unused-expression
  new StreamEmbed(config, fakeFactory);
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  emitterMock.verify();
});
