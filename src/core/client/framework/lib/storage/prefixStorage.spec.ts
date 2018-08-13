import sinon from "sinon";
import prefixStorage from "./prefixStorage";

it("should call clear", () => {
  const storage = {
    clear: sinon.mock().once(),
  };

  const prefixed = prefixStorage(storage as any, "talk");
  prefixed.clear();
  storage.clear.verify();
});

it("should call length", () => {
  const ret = 10;
  const storage = {
    get length() {
      return ret;
    },
  };

  const prefixed = prefixStorage(storage as any, "talk");
  expect(prefixed.length).toBe(ret);
});

it("should call key", () => {
  const ret = "value";
  const storage = {
    key: sinon
      .mock()
      .withArgs(3)
      .returns(ret),
  };

  const prefixed = prefixStorage(storage as any, "talk");
  expect(prefixed.key(3)).toBe(ret);
  (storage.key as any).verify();
});

it("should call key", () => {
  const ret = "value";
  const storage = {
    key: sinon
      .mock()
      .withArgs(3)
      .returns(ret),
  };

  const prefixed = prefixStorage(storage as any, "talk");
  expect(prefixed.key(3)).toBe(ret);
  (storage.key as any).verify();
});

it("should prefix setItem", () => {
  const storage = {
    setItem: sinon.mock().withArgs("talk:key", "value"),
  };

  const prefixed = prefixStorage(storage as any, "talk");
  prefixed.setItem("key", "value");
  storage.setItem.verify();
});

it("should prefix removeItem", () => {
  const storage = {
    removeItem: sinon.mock().withArgs("talk:key"),
  };

  const prefixed = prefixStorage(storage as any, "talk");
  prefixed.removeItem("key");
  storage.removeItem.verify();
});

it("should prefix getItem", () => {
  const ret = "value";
  const storage = {
    getItem: sinon
      .mock()
      .withArgs("talk:key")
      .returns(ret),
  };

  const prefixed = prefixStorage(storage as any, "talk");
  expect(prefixed.getItem("key")).toBe(ret);
  (storage.getItem as any).verify();
});
