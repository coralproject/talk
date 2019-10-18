import { EventEmitter2 } from "eventemitter2";
import { omit } from "lodash";
import sinon, { SinonMock } from "sinon";

import { PymControlConfig } from "./PymControl";
import { StreamEmbed, StreamEmbedConfig } from "./StreamEmbed";

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
  const pymControl = {
    remove: sinon.stub(),
  };
  const fakeFactory: any = () => pymControl;
  const streamEmbed = new StreamEmbed(config, fakeFactory);
  expect(streamEmbed.rendered).toBe(false);
  streamEmbed.render();
  expect(streamEmbed.rendered).toBe(true);
  streamEmbed.remove();
  expect(streamEmbed.rendered).toBe(false);
  expect(pymControl.remove.called).toBe(true);
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
  emitterMock
    .expects("on")
    .withArgs("event", callback)
    .once();
  emitterMock
    .expects("off")
    .withArgs("event", callback)
    .once();
  const streamEmbed = new StreamEmbed(config, fakeFactory);
  streamEmbed.on("event", callback);
  streamEmbed.off("event", callback);
});

describe("should send login message to PymControl", () => {
  let pymControlMock: SinonMock;
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
    const pymControl = {
      // eslint-disable-next-line:no-empty
      sendMessage: () => {},
    };
    const fakeFactory: any = () => pymControl;
    pymControlMock = sinon.mock(pymControl);
    pymControlMock.expects("sendMessage").withArgs("login", "token");
    streamEmbed = new StreamEmbed(config, fakeFactory);
  });

  afterEach(() => {
    pymControlMock.restore();
  });

  it("send login immediately when already ready", () => {
    streamEmbed.render();
    eventEmitter.emit("ready");
    streamEmbed.login("token");
    pymControlMock.verify();
  });

  it("defer login until ready", () => {
    streamEmbed.login("token");
    streamEmbed.render();
    eventEmitter.emit("ready");
    pymControlMock.verify();
  });

  it("do not call login when not ready", () => {
    streamEmbed.login("token");
    streamEmbed.render();
    expect(() => pymControlMock.verify()).toThrow();
  });
});

describe("should send logout message to PymControl", () => {
  let pymControlMock: SinonMock;
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
    const pymControl = {
      // eslint-disable-next-line:no-empty
      sendMessage: () => {},
    };
    const fakeFactory: any = () => pymControl;
    pymControlMock = sinon.mock(pymControl);
    pymControlMock.expects("sendMessage").withArgs("logout");
    streamEmbed = new StreamEmbed(config, fakeFactory);
  });

  afterEach(() => {
    pymControlMock.restore();
  });

  it("send logout immediately when already ready", () => {
    streamEmbed.render();
    eventEmitter.emit("ready");
    streamEmbed.logout();
    pymControlMock.verify();
  });

  it("defer logout until ready", () => {
    streamEmbed.logout();
    streamEmbed.render();
    eventEmitter.emit("ready");
    pymControlMock.verify();
  });

  it("do not call logout when not ready", () => {
    streamEmbed.logout();
    streamEmbed.render();
    expect(() => pymControlMock.verify()).toThrow();
  });
});

it("should pass default values to pymControl", () => {
  const config: StreamEmbedConfig = {
    title: "StreamEmbed",
    eventEmitter: new EventEmitter2(),
    id: "container-id",
    rootURL: "http://localhost/",
  };
  let pymControlConfig: PymControlConfig | null = null;
  const fakeFactory: any = (cfg: PymControlConfig) => {
    pymControlConfig = cfg;
    return {};
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
  let pymControlConfig: PymControlConfig | null = null;
  const fakeFactory: any = (cfg: PymControlConfig) => {
    pymControlConfig = cfg;
    return {};
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
  // eslint-disable-next-line:no-empty
  const fakeFactory: any = () => ({});
  const emitterMock = sinon.mock(config.eventEmitter);
  emitterMock
    .expects("emit")
    .withArgs("showPermalink")
    .once();
  // eslint-disable-next-line:no-unused-expression
  new StreamEmbed(config, fakeFactory);
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  emitterMock.verify();
});
