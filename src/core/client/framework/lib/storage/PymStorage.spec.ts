import createPymStorage from "./PymStorage";

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

describe("PymStorage", () => {
  it("should set item", () => {
    const pym = new PymStub("localStorage");
    const storage = createPymStorage(pym as any, "localStorage");
    const promise = storage.setItem("test", "value");
    const { key, value } = pym.messages.pop()!;
    expect(key).toBe(`pymStorage.localStorage.request`);
    const { id, method, parameters } = JSON.parse(value);
    expect(method).toBe("setItem");
    expect(parameters).toEqual({ key: "test", value: "value" });
    pym.listeners["pymStorage.localStorage.response"](JSON.stringify({ id }));
    expect(promise).resolves.toBeUndefined();
  });

  it("should remove item", () => {
    const pym = new PymStub("localStorage");
    const storage = createPymStorage(pym as any, "localStorage");
    const promise = storage.removeItem("test");
    const { key, value } = pym.messages.pop()!;
    expect(key).toBe(`pymStorage.localStorage.request`);
    const { id, method, parameters } = JSON.parse(value);
    expect(method).toBe("removeItem");
    expect(parameters).toEqual({ key: "test" });
    pym.listeners["pymStorage.localStorage.response"](JSON.stringify({ id }));
    expect(promise).resolves.toBeUndefined();
  });

  it("should get item", () => {
    const pym = new PymStub("localStorage");
    const storage = createPymStorage(pym as any, "localStorage");
    const promise = storage.getItem("test");
    const { key, value } = pym.messages.pop()!;
    expect(key).toBe(`pymStorage.localStorage.request`);
    const { id, method, parameters } = JSON.parse(value);
    expect(method).toBe("getItem");
    expect(parameters).toEqual({ key: "test" });
    pym.listeners["pymStorage.localStorage.response"](
      JSON.stringify({ id, result: "value" })
    );
    expect(promise).resolves.toBe("value");
  });

  it("should get length", () => {
    const pym = new PymStub("localStorage");
    const storage = createPymStorage(pym as any, "localStorage");
    const promise = storage.length;
    const { key, value } = pym.messages.pop()!;
    expect(key).toBe(`pymStorage.localStorage.request`);
    const { id, method, parameters } = JSON.parse(value);
    expect(method).toBe("length");
    expect(parameters).toEqual({});
    pym.listeners["pymStorage.localStorage.response"](
      JSON.stringify({ id, result: 3 })
    );
    expect(promise).resolves.toBe(3);
  });

  it("should get key", () => {
    const pym = new PymStub("localStorage");
    const storage = createPymStorage(pym as any, "localStorage");
    const promise = storage.key(2);
    const { key, value } = pym.messages.pop()!;
    expect(key).toBe(`pymStorage.localStorage.request`);
    const { id, method, parameters } = JSON.parse(value);
    expect(method).toBe("key");
    expect(parameters).toEqual({ n: 2 });
    pym.listeners["pymStorage.localStorage.response"](
      JSON.stringify({ id, result: "myKey" })
    );
    expect(promise).resolves.toBe("myKey");
  });

  it("should clear", () => {
    const pym = new PymStub("localStorage");
    const storage = createPymStorage(pym as any, "localStorage");
    const promise = storage.clear();
    const { key, value } = pym.messages.pop()!;
    expect(key).toBe(`pymStorage.localStorage.request`);
    const { id, method, parameters } = JSON.parse(value);
    expect(method).toBe("clear");
    expect(parameters).toEqual({});
    pym.listeners["pymStorage.localStorage.response"](JSON.stringify({ id }));
    expect(promise).resolves.toBeUndefined();
  });

  describe("on error", () => {
    it("should reject set item", () => {
      const pym = new PymStub("localStorage");
      const storage = createPymStorage(pym as any, "localStorage");
      const promise = storage.setItem("test", "value");
      const { key, value } = pym.messages.pop()!;
      expect(key).toBe(`pymStorage.localStorage.request`);
      const { id } = JSON.parse(value);
      pym.listeners["pymStorage.localStorage.error"](
        JSON.stringify({ id, error: "error" })
      );
      expect(promise).rejects.toThrow(new Error("error"));
    });
    it("should reject remove item", () => {
      const pym = new PymStub("localStorage");
      const storage = createPymStorage(pym as any, "localStorage");
      const promise = storage.removeItem("test");
      const { key, value } = pym.messages.pop()!;
      expect(key).toBe(`pymStorage.localStorage.request`);
      const { id } = JSON.parse(value);
      pym.listeners["pymStorage.localStorage.error"](
        JSON.stringify({ id, error: "error" })
      );
      expect(promise).rejects.toThrow(new Error("error"));
    });
    it("should reject get item", () => {
      const pym = new PymStub("localStorage");
      const storage = createPymStorage(pym as any, "localStorage");
      const promise = storage.getItem("test");
      const { key, value } = pym.messages.pop()!;
      expect(key).toBe(`pymStorage.localStorage.request`);
      const { id } = JSON.parse(value);
      pym.listeners["pymStorage.localStorage.error"](
        JSON.stringify({ id, error: "error" })
      );
      expect(promise).rejects.toThrow(new Error("error"));
    });
  });
});
