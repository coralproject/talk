import mockConsole from "jest-mock-console";
import sinon from "sinon";

import { createInMemoryStorage } from "talk-framework/lib/storage";
import withPymStorage from "./withPymStorage";

class PymStub {
  public listeners: Record<string, (msg: string) => void> = {};
  public messages: Array<{ key: string; value: string }> = [];
  public type: string;

  constructor(type: string) {
    this.type = type;
  }

  public onMessage(key: string, callback: (msg: string) => void) {
    this.listeners[key] = callback;
  }
  public sendMessage(key: string, value: string) {
    this.messages.push({ key, value });
  }
}

describe("withPymStorage", () => {
  it("should set, get and remove item", () => {
    const pym = new PymStub("localStorage");
    const storage = createInMemoryStorage();
    withPymStorage(storage, "localStorage", "talk:")(pym as any);
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "0",
        method: "setItem",
        parameters: { key: "key", value: "test" },
      })
    );
    expect(storage.toString()).toMatchSnapshot();
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "1",
        method: "getItem",
        parameters: { key: "key" },
      })
    );
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "2",
        method: "removeItem",
        parameters: { key: "key" },
      })
    );
    expect(storage.toString()).toMatchSnapshot();
    expect(JSON.stringify(pym.messages)).toMatchSnapshot();
  });
  it("should get key of storage", () => {
    const pym = new PymStub("localStorage");
    const storage = createInMemoryStorage({
      a: "1",
      b: "2",
      c: "3",
    });
    withPymStorage(storage, "localStorage", "")(pym as any);
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "0",
        method: "key",
        parameters: { n: 1 },
      })
    );
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "0",
        method: "key",
        parameters: { n: 3 },
      })
    );
    expect(pym.messages).toMatchSnapshot();
  });
  it("should get length of storage", () => {
    const pym = new PymStub("localStorage");
    const storage = createInMemoryStorage({
      a: "1",
      b: "2",
      c: "3",
    });
    withPymStorage(storage, "localStorage", "")(pym as any);
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "0",
        method: "length",
        parameters: {},
      })
    );
    expect(pym.messages).toMatchSnapshot();
  });
  it("should clear storage", () => {
    const pym = new PymStub("localStorage");
    const storage = createInMemoryStorage({
      a: "1",
      b: "2",
      c: "3",
    });
    withPymStorage(storage, "localStorage", "")(pym as any);
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "0",
        method: "clear",
        parameters: {},
      })
    );
    expect(storage.toString()).toMatchSnapshot();
    expect(pym.messages).toMatchSnapshot();
  });
  it("should handle unknown method", () => {
    mockConsole();
    const pym = new PymStub("localStorage");
    const storage = createInMemoryStorage();
    withPymStorage(storage, "localStorage", "talk:")(pym as any);
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "0",
        method: "unknown",
        parameters: {},
      })
    );
    expect(JSON.stringify(pym.messages)).toMatchSnapshot();
    // tslint:disable-next-line: no-console
    expect(console.error).toHaveBeenCalled();
  });
  it("should handle handle errors", () => {
    mockConsole();
    const pym = new PymStub("localStorage");
    const storage = createInMemoryStorage();
    sinon
      .mock(storage)
      .expects("getItem")
      .throws("error");
    withPymStorage(storage, "localStorage", "talk:")(pym as any);
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "0",
        method: "getItem",
        parameters: {},
      })
    );
    expect(pym.messages).toMatchSnapshot();
    // tslint:disable-next-line: no-console
    expect(console.error).toHaveBeenCalled();
  });
});
