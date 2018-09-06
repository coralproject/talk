import sinon from "sinon";

import withPymStorage from "./withPymStorage";

// tslint:disable:max-classes-per-file

class FakeStorage {
  public store: Record<string, string> = {};

  public setItem(key: string, value: string) {
    this.store[key] = value;
  }
  public removeItem(key: string) {
    delete this.store[key];
  }
  public getItem(key: string) {
    return this.store[key];
  }
}

class PymStub {
  public listeners: Record<string, ((msg: string) => void)> = {};
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
    const storage = new FakeStorage();
    withPymStorage(storage as any, "localStorage", "talkPymStorage:")(
      pym as any
    );
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "0",
        method: "setItem",
        parameters: { key: "key", value: "test" },
      })
    );
    expect(storage.store).toMatchSnapshot();
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
    expect(storage.store).toMatchSnapshot();
    expect(JSON.stringify(pym.messages)).toMatchSnapshot();
  });
  it("should handle unknown method", () => {
    const pym = new PymStub("localStorage");
    const storage = new FakeStorage();
    withPymStorage(storage as any, "localStorage", "talkPymStorage:")(
      pym as any
    );
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "0",
        method: "unknown",
        parameters: {},
      })
    );
    expect(JSON.stringify(pym.messages)).toMatchSnapshot();
  });
  it("should handle handle errors", () => {
    const pym = new PymStub("localStorage");
    const storage = new FakeStorage();
    sinon
      .mock(storage)
      .expects("getItem")
      .throws("error");
    withPymStorage(storage as any, "localStorage", "talkPymStorage:")(
      pym as any
    );
    pym.listeners["pymStorage.localStorage.request"](
      JSON.stringify({
        id: "0",
        method: "getItem",
        parameters: {},
      })
    );
    expect(JSON.stringify(pym.messages)).toMatchSnapshot();
  });
});
