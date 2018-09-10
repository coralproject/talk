import sinon from "sinon";
import createInMemoryStorage from "./InMemoryStorage";
import prefixStorage from "./prefixStorage";

it("should get nth key", () => {
  const storage = createInMemoryStorage({
    a: "0",
    b: "1",
    "talk:c": "2",
    d: "3",
    "talk:e": "4",
  });

  const prefixed = prefixStorage(storage, "talk:");
  expect(prefixed.key(0)).toBe("talk:c");
  expect(prefixed.key(1)).toBe("talk:e");
  expect(prefixed.key(2)).toBeNull();
});

it("should call clear", () => {
  const storage = createInMemoryStorage({
    a: "0",
    b: "1",
    "talk:c": "2",
    d: "3",
    "talk:e": "4",
  });

  const prefixed = prefixStorage(storage, "talk:");
  prefixed.clear();
  expect(storage.toString()).toMatchSnapshot();
});

it("should call length", () => {
  const storage = createInMemoryStorage({
    a: "0",
    b: "1",
    "talk:c": "2",
    d: "3",
    "talk:e": "4",
  });

  const prefixed = prefixStorage(storage, "talk:");
  expect(prefixed.length).toBe(2);
});

it("should prefix setItem", () => {
  const storage = {
    setItem: sinon.mock().withArgs("talk:key", "value"),
  };

  const prefixed = prefixStorage(storage as any, "talk:");
  prefixed.setItem("key", "value");
  storage.setItem.verify();
});

it("should prefix removeItem", () => {
  const storage = {
    removeItem: sinon.mock().withArgs("talk:key"),
  };

  const prefixed = prefixStorage(storage as any, "talk:");
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

  const prefixed = prefixStorage(storage as any, "talk:");
  expect(prefixed.getItem("key")).toBe(ret);
  (storage.getItem as any).verify();
});
