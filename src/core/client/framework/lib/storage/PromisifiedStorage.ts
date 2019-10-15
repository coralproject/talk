import createInMemoryStorage from "./InMemoryStorage";

export interface PromisifiedStorage {
  length: Promise<number>;

  clear(): Promise<void>;

  key(n: number): Promise<string | null>;

  /**
   * value = storage[key]
   */
  getItem(key: string): Promise<string | null>;
  /**
   * delete storage[key]
   */
  removeItem(key: string): Promise<void>;
  /**
   * storage[key] = value
   */
  setItem(key: string, value: string): Promise<void>;
}

/**
 * BackedPromisifedStorage.
 */
class BackedPromisifedStorage implements PromisifiedStorage {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  public get length() {
    return Promise.resolve(this.storage.length);
  }

  public clear() {
    return Promise.resolve(this.storage.clear());
  }

  public key(n: number) {
    return Promise.resolve(this.storage.key(n));
  }

  public getItem(key: string) {
    return Promise.resolve(this.storage.getItem(key));
  }

  public setItem(key: string, value: string) {
    return Promise.resolve(this.storage.setItem(key, value));
  }

  public removeItem(key: string) {
    return Promise.resolve(this.storage.removeItem(key));
  }
}

export default function createPromisifiedStorage(
  storage: Storage = createInMemoryStorage()
) {
  return new BackedPromisifedStorage(storage);
}
