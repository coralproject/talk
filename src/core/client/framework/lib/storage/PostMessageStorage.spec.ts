import createdPostMessageStorage from "./PostMessageStorage";

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

describe("dPostMessageStorage", () => {
  it("should set item", async () => {
    const postMessage = new PostMessageStub("localStorage");
    const storage = createdPostMessageStorage(
      postMessage as any,
      "localStorage"
    );
    const promise = storage.setItem("test", "value");
    const { key, value } = postMessage.messages.pop()!;
    expect(key).toBe(`postMessageStorage.localStorage.request`);
    const { id, method, parameters } = value;
    expect(method).toBe("setItem");
    expect(parameters).toEqual({ key: "test", value: "value" });
    postMessage.listeners["postMessageStorage.localStorage.response"]({ id });
    await expect(promise).resolves.toBeUndefined();
  });

  it("should remove item", async () => {
    const postMessage = new PostMessageStub("localStorage");
    const storage = createdPostMessageStorage(
      postMessage as any,
      "localStorage"
    );
    const promise = storage.removeItem("test");
    const { key, value } = postMessage.messages.pop()!;
    expect(key).toBe(`postMessageStorage.localStorage.request`);
    const { id, method, parameters } = value;
    expect(method).toBe("removeItem");
    expect(parameters).toEqual({ key: "test" });
    postMessage.listeners["postMessageStorage.localStorage.response"]({ id });
    await expect(promise).resolves.toBeUndefined();
  });

  it("should get item", async () => {
    const postMessage = new PostMessageStub("localStorage");
    const storage = createdPostMessageStorage(
      postMessage as any,
      "localStorage"
    );
    const promise = storage.getItem("test");
    const { key, value } = postMessage.messages.pop()!;
    expect(key).toBe(`postMessageStorage.localStorage.request`);
    const { id, method, parameters } = value;
    expect(method).toBe("getItem");
    expect(parameters).toEqual({ key: "test" });
    postMessage.listeners["postMessageStorage.localStorage.response"]({
      id,
      result: "value",
    });
    await expect(promise).resolves.toBe("value");
  });

  it("should get length", async () => {
    const postMessage = new PostMessageStub("localStorage");
    const storage = createdPostMessageStorage(
      postMessage as any,
      "localStorage"
    );
    const promise = storage.length;
    const { key, value } = postMessage.messages.pop()!;
    expect(key).toBe(`postMessageStorage.localStorage.request`);
    const { id, method, parameters } = value;
    expect(method).toBe("length");
    expect(parameters).toEqual({});
    postMessage.listeners["postMessageStorage.localStorage.response"]({
      id,
      result: 3,
    });
    await expect(promise).resolves.toBe(3);
  });

  it("should get key", async () => {
    const postMessage = new PostMessageStub("localStorage");
    const storage = createdPostMessageStorage(
      postMessage as any,
      "localStorage"
    );
    const promise = storage.key(2);
    const { key, value } = postMessage.messages.pop()!;
    expect(key).toBe(`postMessageStorage.localStorage.request`);
    const { id, method, parameters } = value;
    expect(method).toBe("key");
    expect(parameters).toEqual({ n: 2 });
    postMessage.listeners["postMessageStorage.localStorage.response"]({
      id,
      result: "myKey",
    });
    await expect(promise).resolves.toBe("myKey");
  });

  it("should clear", async () => {
    const postMessage = new PostMessageStub("localStorage");
    const storage = createdPostMessageStorage(
      postMessage as any,
      "localStorage"
    );
    const promise = storage.clear();
    const { key, value } = postMessage.messages.pop()!;
    expect(key).toBe(`postMessageStorage.localStorage.request`);
    const { id, method, parameters } = value;
    expect(method).toBe("clear");
    expect(parameters).toEqual({});
    postMessage.listeners["postMessageStorage.localStorage.response"]({ id });
    await expect(promise).resolves.toBeUndefined();
  });

  describe("on error", () => {
    it("should reject set item", async () => {
      const postMessage = new PostMessageStub("localStorage");
      const storage = createdPostMessageStorage(
        postMessage as any,
        "localStorage"
      );
      const promise = storage.setItem("test", "value");
      const { key, value } = postMessage.messages.pop()!;
      expect(key).toBe(`postMessageStorage.localStorage.request`);
      const { id } = value;
      postMessage.listeners["postMessageStorage.localStorage.error"]({
        id,
        error: "error",
      });
      await expect(promise).rejects.toThrow(new Error("error"));
    });
    it("should reject remove item", async () => {
      const postMessage = new PostMessageStub("localStorage");
      const storage = createdPostMessageStorage(
        postMessage as any,
        "localStorage"
      );
      const promise = storage.removeItem("test");
      const { key, value } = postMessage.messages.pop()!;
      expect(key).toBe(`postMessageStorage.localStorage.request`);
      const { id } = value;
      postMessage.listeners["postMessageStorage.localStorage.error"]({
        id,
        error: "error",
      });
      await expect(promise).rejects.toThrow(new Error("error"));
    });
    it("should reject get item", async () => {
      const postMessage = new PostMessageStub("localStorage");
      const storage = createdPostMessageStorage(
        postMessage as any,
        "localStorage"
      );
      const promise = storage.getItem("test");
      const { key, value } = postMessage.messages.pop()!;
      expect(key).toBe(`postMessageStorage.localStorage.request`);
      const { id } = value;
      postMessage.listeners["postMessageStorage.localStorage.error"]({
        id,
        error: "error",
      });
      await expect(promise).rejects.toThrow(new Error("error"));
    });
  });
});
