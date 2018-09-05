/**
 * InMemoryStorage is a dumb implementation of the Storage interface that will
 * not persist the data at all. It implements the Storage interface found:
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
class InMemoryStorage implements Storage {
  private storage: Record<string, string>;

  constructor() {
    this.storage = {};
  }

  get length() {
    return Object.keys(this.storage).length;
  }

  public clear() {
    this.storage = {};
  }

  public key(n: number) {
    if (this.length <= n) {
      return null;
    }

    return this.storage[Object.keys(this.storage)[n]];
  }

  public getItem(key: string) {
    return this.storage[key] || null;
  }

  public setItem(key: string, value: string) {
    this.storage[key] = value;
  }

  public removeItem(key: string) {
    delete this.storage[key];
  }

  public toString() {
    return JSON.stringify(this.storage);
  }
}

export default function createInMemoryStorage() {
  return new InMemoryStorage();
}
