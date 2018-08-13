import createInMemoryStorage from "./InMemoryStorage";

it("should set and unset values", () => {
  const storage = createInMemoryStorage();
  storage.setItem("test", "value");
  expect(storage.getItem("test")).toBe("value");
  storage.removeItem("test");
  expect(storage.getItem("test")).toBeUndefined();
});

it("should return length", () => {
  const storage = createInMemoryStorage();
  storage.setItem("a", "value");
  storage.setItem("b", "value");
  storage.setItem("c", "value");
  expect(storage.length).toBe(3);
});

it("should nth value", () => {
  const storage = createInMemoryStorage();
  storage.setItem("a", "a");
  storage.setItem("b", "b");
  storage.setItem("c", "c");
  expect(storage.key(2)).toBe("c");
});
