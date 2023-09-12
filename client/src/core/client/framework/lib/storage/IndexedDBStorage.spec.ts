import FDBFactory from "fake-indexeddb/lib/FDBFactory";

import createIndexedDBStorage from "./IndexedDBStorage";

it("should set and unset values", async () => {
  const storage = createIndexedDBStorage("coral", new FDBFactory());
  await storage.setItem("test", "value");
  await expect(storage.getItem("test")).resolves.toBe("value");
  await storage.removeItem("test");
  await expect(storage.getItem("test")).resolves.toBeNull();
});

it("should return length", async () => {
  const storage = createIndexedDBStorage("coral", new FDBFactory());
  await storage.setItem("a", "value");
  await storage.setItem("b", "value");
  await storage.setItem("c", "value");
  await expect(storage.length).resolves.toBe(3);
});

/*
it("should nth value", async () => {
  const storage = createIndexedDBStorage("coral", new FDBFactory());
  await storage.setItem("a", "a");
  await storage.setItem("b", "b");
  await storage.setItem("c", "c");
  await expect(storage.key(2)).resolves.toBe("c");
});
*/
