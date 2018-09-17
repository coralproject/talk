import { EventEmitter2 } from "eventemitter2";
import { omit } from "lodash";
import sinon from "sinon";

import { PymControlConfig } from "./PymControl";
import { StreamEmbed, StreamEmbedConfig } from "./StreamEmbed";

it("should throw when calling pym dependent methods but was not rendered", () => {
  const config: StreamEmbedConfig = {
    title: "StreamEmbed",
    eventEmitter: new EventEmitter2(),
    id: "container-id",
    rootURL: "http://localhost/",
  };
  const streamEmbed = new StreamEmbed(config);
  [
    () => streamEmbed.login("token"),
    () => streamEmbed.logout(),
    () => streamEmbed.remove(),
  ].forEach(cb => {
    expect(cb).toThrow();
  });
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
  // tslint:disable-next-line:no-empty
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

it("should send login message to PymControl", () => {
  const config: StreamEmbedConfig = {
    title: "StreamEmbed",
    eventEmitter: new EventEmitter2(),
    id: "container-id",
    rootURL: "http://localhost/",
  };
  const pymControl = {
    // tslint:disable-next-line:no-empty
    sendMessage: () => {},
  };
  const pymControlMock = sinon.mock(pymControl);
  pymControlMock.expects("sendMessage").withArgs("login", "token");
  const fakeFactory: any = () => pymControl;
  const streamEmbed = new StreamEmbed(config, fakeFactory);
  streamEmbed.render();
  streamEmbed.login("token");
  pymControlMock.verify();
});

it("should send logout message to PymControl", () => {
  const config: StreamEmbedConfig = {
    title: "StreamEmbed",
    eventEmitter: new EventEmitter2(),
    id: "container-id",
    rootURL: "http://localhost/",
  };
  const pymControl = {
    // tslint:disable-next-line:no-empty
    sendMessage: () => {},
  };
  const pymControlMock = sinon.mock(pymControl);
  pymControlMock.expects("sendMessage").withArgs("logout");
  const fakeFactory: any = () => pymControl;
  const streamEmbed = new StreamEmbed(config, fakeFactory);
  streamEmbed.render();
  streamEmbed.logout();
  pymControlMock.verify();
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
    assetID: "asset-id",
    assetURL: "asset-url",
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
  // tslint:disable-next-line:no-empty
  const fakeFactory: any = () => ({});
  const emitterMock = sinon.mock(config.eventEmitter);
  emitterMock
    .expects("emit")
    .withArgs("showPermalink")
    .once();
  // tslint:disable-next-line:no-unused-expression
  new StreamEmbed(config, fakeFactory);
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  emitterMock.verify();
});
