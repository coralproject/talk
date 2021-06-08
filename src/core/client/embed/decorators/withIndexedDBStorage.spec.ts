import FDBFactory from "fake-indexeddb/lib/FDBFactory";
import mockConsole from "jest-mock-console";

import { waitFor } from "coral-common/helpers";
import { wait } from "coral-framework/testHelpers";

import withIndexedDBStorage from "./withIndexedDBStorage";

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

describe("withIndexedDBStorage", () => {
  it("should set, get and remove item", async () => {
    const postMessage = new PostMessageStub("localStorage");
    (withIndexedDBStorage("coral") as any)(null, postMessage, new FDBFactory());
    await wait(() =>
      expect(
        postMessage.listeners["postMessageStorage.indexedDB.request"]
      ).toBeDefined()
    );
    // Wait for db to be initialized.
    await waitFor(10);
    postMessage.listeners["postMessageStorage.indexedDB.request"]({
      id: "0",
      method: "setItem",
      parameters: { key: "key", value: "test" },
    });
    postMessage.listeners["postMessageStorage.indexedDB.request"]({
      id: "1",
      method: "setItem",
      parameters: { key: "key2", value: "test2" },
    });
    postMessage.listeners["postMessageStorage.indexedDB.request"]({
      id: "2",
      method: "getItem",
      parameters: { key: "key" },
    });
    postMessage.listeners["postMessageStorage.indexedDB.request"]({
      id: "3",
      method: "length",
      parameters: {},
    });
    postMessage.listeners["postMessageStorage.indexedDB.request"]({
      id: "4",
      method: "removeItem",
      parameters: { key: "key" },
    });
    postMessage.listeners["postMessageStorage.indexedDB.request"]({
      id: "5",
      method: "getItem",
      parameters: { key: "key" },
    });
    postMessage.listeners["postMessageStorage.indexedDB.request"]({
      id: "6",
      method: "clear",
      parameters: {},
    });
    postMessage.listeners["postMessageStorage.indexedDB.request"]({
      id: "7",
      method: "length",
      parameters: {},
    });
    await wait(() =>
      expect(postMessage.messages.length).toBeGreaterThanOrEqual(8)
    );
    expect(postMessage.messages).toMatchSnapshot();
  });
  it("should handle unknown method", () => {
    mockConsole();
    const postMessage = new PostMessageStub("localStorage");
    (withIndexedDBStorage("coral") as any)(null, postMessage, new FDBFactory());
    postMessage.listeners["postMessageStorage.indexedDB.request"]({
      id: "0",
      method: "unknown",
      parameters: {},
    });
    expect(postMessage.messages).toMatchSnapshot();
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalled();
  });
  /* TODO.
  it("should get key of storage", () => {
  });
  it("should handle handle errors", () => {
  });
  */
});
