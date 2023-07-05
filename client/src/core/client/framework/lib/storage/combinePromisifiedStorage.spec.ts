import combinePromisifiedStorage from "./combinePromisifiedStorage";
import createInMemoryStorage from "./InMemoryStorage";
import createPromisifiedStorage, {
  PromisifiedStorage,
} from "./PromisifiedStorage";

/**
 * NotRespondingStorage.
 */
class NotRespondingStorage implements PromisifiedStorage {
  public get length() {
    return new Promise(() => {}) as any;
  }

  public clear() {
    return new Promise(() => {}) as any;
  }

  public key(n: number) {
    return new Promise(() => {}) as any;
  }

  public getItem(key: string) {
    return new Promise(() => {}) as any;
  }

  public setItem(key: string, value: string) {
    return new Promise(() => {}) as any;
  }

  public removeItem(key: string) {
    return new Promise(() => {}) as any;
  }
}

it("should set and unset values", async () => {
  const storageA = createPromisifiedStorage(createInMemoryStorage());
  const storageB = new NotRespondingStorage();
  const storage = combinePromisifiedStorage(storageA, storageB);
  await expect(storage.setItem("test", "value")).resolves.toBeUndefined();
  await expect(storage.getItem("test")).resolves.toBe("value");
  await storage.removeItem("test");
  await expect(storage.getItem("test")).resolves.toBeNull();
});

it("should return length", async () => {
  const storageA = new NotRespondingStorage();
  const storageB = createPromisifiedStorage(createInMemoryStorage());
  const storage = combinePromisifiedStorage(storageA, storageB);
  await storage.setItem("a", "value");
  await storage.setItem("b", "value");
  await storage.setItem("c", "value");
  await expect(storage.length).resolves.toBe(3);
});

it("should nth value", async () => {
  const storageA = createPromisifiedStorage(createInMemoryStorage());
  const storageB = new NotRespondingStorage();
  const storage = combinePromisifiedStorage(storageA, storageB);
  await storage.setItem("a", "a");
  await storage.setItem("b", "b");
  await storage.setItem("c", "c");
  await expect(storage.key(2)).resolves.toBe("c");
});
