import sinon from "sinon";

import createInMemoryStorage from "./InMemoryStorage";
import prefixStorage from "./prefixStorage";

it("should get nth key", () => {
  const storage = createInMemoryStorage({
    a: "0",
    b: "1",
    "coral:c": "2",
    d: "3",
    "coral:e": "4",
  });

  const prefixed = prefixStorage(storage, "coral:");
  expect(prefixed.key(0)).toBe("coral:c");
  expect(prefixed.key(1)).toBe("coral:e");
  expect(prefixed.key(2)).toBeNull();
});

it("should call clear", () => {
  const storage = createInMemoryStorage({
    a: "0",
    b: "1",
    "coral:c": "2",
    d: "3",
    "coral:e": "4",
  });

  const prefixed = prefixStorage(storage, "coral:");
  prefixed.clear();
  expect(storage.toString()).toMatchSnapshot();
});

it("should call length", () => {
  const storage = createInMemoryStorage({
    a: "0",
    b: "1",
    "coral:c": "2",
    d: "3",
    "coral:e": "4",
  });

  const prefixed = prefixStorage(storage, "coral:");
  expect(prefixed.length).toBe(2);
});

it("should prefix setItem", () => {
  const storage = {
    setItem: sinon.mock().withArgs("coral:key", "value"),
  };

  const prefixed = prefixStorage(storage as any, "coral:");
  prefixed.setItem("key", "value");
  storage.setItem.verify();
});

it("should prefix removeItem", () => {
  const storage = {
    removeItem: sinon.mock().withArgs("coral:key"),
  };

  const prefixed = prefixStorage(storage as any, "coral:");
  prefixed.removeItem("key");
  storage.removeItem.verify();
});

it("should prefix getItem", () => {
  const ret = "value";
  const storage = {
    getItem: sinon.mock().withArgs("coral:key").returns(ret),
  };

  const prefixed = prefixStorage(storage as any, "coral:");
  expect(prefixed.getItem("key")).toBe(ret);
  (storage.getItem as any).verify();
});
