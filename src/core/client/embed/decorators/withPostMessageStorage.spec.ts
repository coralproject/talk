import mockConsole from "jest-mock-console";
import sinon from "sinon";

import { createInMemoryStorage } from "coral-framework/lib/storage";

import withPostMessageStorage from "./withPostMessageStorage";

class PostMessageStub {
  public listeners: Record<string, (msg: any) => void> = {};
  public messages: Array<{ key: string; value: any }> = [];
  public type: string;

  constructor(type: string) {
    this.type = type;
  }

  public on(key: string, callback: (msg: string) => void) {
    this.listeners[key] = callback;
  }
  public send(key: string, value: any) {
    this.messages.push({ key, value });
  }
}

describe("withPostMessageStorage", () => {
  it("should set, get and remove item", () => {
    const postMessage = new PostMessageStub("localStorage");
    const storage = createInMemoryStorage();
    withPostMessageStorage(
      storage,
      "localStorage",
      "coral:"
    )(null as any, postMessage as any);
    postMessage.listeners["postMessageStorage.localStorage.request"]({
      id: "0",
      method: "setItem",
      parameters: { key: "key", value: "test" },
    });
    expect(storage.toString()).toMatchSnapshot();
    postMessage.listeners["postMessageStorage.localStorage.request"]({
      id: "1",
      method: "getItem",
      parameters: { key: "key" },
    });
    postMessage.listeners["postMessageStorage.localStorage.request"]({
      id: "2",
      method: "removeItem",
      parameters: { key: "key" },
    });
    expect(storage.toString()).toMatchSnapshot();
    expect(postMessage.messages).toMatchSnapshot();
  });
  it("should get key of storage", () => {
    const postMessage = new PostMessageStub("localStorage");
    const storage = createInMemoryStorage({
      a: "1",
      b: "2",
      c: "3",
    });
    withPostMessageStorage(
      storage,
      "localStorage",
      ""
    )(null as any, postMessage as any);
    postMessage.listeners["postMessageStorage.localStorage.request"]({
      id: "0",
      method: "key",
      parameters: { n: 1 },
    });
    postMessage.listeners["postMessageStorage.localStorage.request"]({
      id: "0",
      method: "key",
      parameters: { n: 3 },
    });
    expect(postMessage.messages).toMatchSnapshot();
  });
  it("should get length of storage", () => {
    const postMessage = new PostMessageStub("localStorage");
    const storage = createInMemoryStorage({
      a: "1",
      b: "2",
      c: "3",
    });
    withPostMessageStorage(
      storage,
      "localStorage",
      ""
    )(null as any, postMessage as any);
    postMessage.listeners["postMessageStorage.localStorage.request"]({
      id: "0",
      method: "length",
      parameters: {},
    });
    expect(postMessage.messages).toMatchSnapshot();
  });
  it("should clear storage", () => {
    const postMessage = new PostMessageStub("localStorage");
    const storage = createInMemoryStorage({
      a: "1",
      b: "2",
      c: "3",
    });
    withPostMessageStorage(
      storage,
      "localStorage",
      ""
    )(null as any, postMessage as any);
    postMessage.listeners["postMessageStorage.localStorage.request"]({
      id: "0",
      method: "clear",
      parameters: {},
    });
    expect(storage.toString()).toMatchSnapshot();
    expect(postMessage.messages).toMatchSnapshot();
  });
  it("should handle unknown method", () => {
    mockConsole();
    const postMessage = new PostMessageStub("localStorage");
    const storage = createInMemoryStorage();
    withPostMessageStorage(
      storage,
      "localStorage",
      "coral:"
    )(null as any, postMessage as any);
    postMessage.listeners["postMessageStorage.localStorage.request"]({
      id: "0",
      method: "unknown",
      parameters: {},
    });
    expect(postMessage.messages).toMatchSnapshot();
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalled();
  });
  it("should handle handle errors", () => {
    mockConsole();
    const postMessage = new PostMessageStub("localStorage");
    const storage = createInMemoryStorage();
    sinon.mock(storage).expects("getItem").throws("error");
    withPostMessageStorage(
      storage,
      "localStorage",
      "coral:"
    )(null as any, postMessage as any);
    postMessage.listeners["postMessageStorage.localStorage.request"]({
      id: "0",
      method: "getItem",
      parameters: {},
    });
    expect(postMessage.messages).toMatchSnapshot();
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalled();
  });
});
