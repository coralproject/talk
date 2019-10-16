/**
 * InMemoryStorage is a dumb implementation of the Storage interface that will
 * not persist the data at all. It implements the Storage interface found:
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
class InMemoryStorage implements Storage {
  private data: Record<string, string>;

  constructor(data: Record<string, string> = {}) {
    this.data = data;
  }

  public get length() {
    return Object.keys(this.data).length;
  }

  public clear() {
    this.data = {};
  }

  public key(n: number) {
    if (this.length <= n) {
      return null;
    }

    return Object.keys(this.data)[n];
  }

  public getItem(key: string) {
    return this.data[key] || null;
  }

  public setItem(key: string, value: string) {
    this.data[key] = value;
  }

  public removeItem(key: string) {
    delete this.data[key];
  }

  public toString() {
    return JSON.stringify(this.data);
  }
}

export default function createInMemoryStorage(data?: Record<string, string>) {
  return new InMemoryStorage(data);
}
