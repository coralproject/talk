export interface PromisifiedStorage {
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

export default function createPromisifiedStorage(storage: Storage) {
  return new BackedPromisifedStorage(storage);
}
