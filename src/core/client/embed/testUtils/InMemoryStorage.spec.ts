import createInMemoryStorage from "./InMemoryStorage";

it("should set and unset values", () => {
  const storage = createInMemoryStorage();
  storage.setItem("test", "value");
  expect(storage.getItem("test")).toBe("value");
  storage.removeItem("test");
  expect(storage.getItem("test")).toBeNull();
});

it("should return length", () => {
  const storage = createInMemoryStorage();
  storage.setItem("a", "value");
  storage.setItem("b", "value");
  storage.setItem("c", "value");
  expect(storage.length).toBe(3);
});

it("should nth key", () => {
  const storage = createInMemoryStorage();
  storage.setItem("a", "0");
  storage.setItem("b", "1");
  storage.setItem("c", "2");
  expect(storage.key(2)).toBe("c");
});

it("accepts predefined data", () => {
  const storage = createInMemoryStorage({
    a: "0",
    b: "1",
    c: "2",
  });
  expect(storage.toString()).toMatchSnapshot();
});
