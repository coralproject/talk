import createInMemoryStorage from "./InMemoryStorage";
import createPromisifiedStorage from "./PromisifiedStorage";

it("should set and unset values", () => {
  const storage = createPromisifiedStorage(createInMemoryStorage());
  expect(storage.setItem("test", "value")).resolves.toBeUndefined();
  expect(storage.getItem("test")).resolves.toBe("value");
  storage.removeItem("test");
  expect(storage.getItem("test")).resolves.toBeUndefined();
});
