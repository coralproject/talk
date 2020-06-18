import createInMemoryStorage from "./InMemoryStorage";
import createPromisifiedStorage from "./PromisifiedStorage";

it("should set and unset values", async () => {
  const storage = createPromisifiedStorage(createInMemoryStorage());
  await expect(storage.setItem("test", "value")).resolves.toBeUndefined();
  await expect(storage.getItem("test")).resolves.toBe("value");
  await storage.removeItem("test");
  await expect(storage.getItem("test")).resolves.toBeNull();
});

it("should return length", async () => {
  const storage = createPromisifiedStorage(createInMemoryStorage());
  await storage.setItem("a", "value");
  await storage.setItem("b", "value");
  await storage.setItem("c", "value");
  await expect(storage.length).resolves.toBe(3);
});

it("should nth value", async () => {
  const storage = createPromisifiedStorage(createInMemoryStorage());
  await storage.setItem("a", "a");
  await storage.setItem("b", "b");
  await storage.setItem("c", "c");
  await expect(storage.key(2)).resolves.toBe("c");
});
