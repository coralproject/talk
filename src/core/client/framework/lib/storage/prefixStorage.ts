/**
 * PrefixedStorage decorates a Storage and prefixes keys in
 * getItem, setItem and removeItem with given prefix.
 */
class PrefixedStorage implements Storage {
  private storage: Storage;
  private prefix: string;

  constructor(storage: Storage, prefix: string) {
    this.storage = storage;
    this.prefix = prefix;
  }

  get length() {
    return this.storage.length;
  }

  public clear() {
    this.storage.clear();
  }

  public key(n: number) {
    return this.storage.key(n);
  }

  public getItem(key: string) {
    return this.storage.getItem(`${this.prefix}:${key}`);
  }

  public setItem(key: string, value: string) {
    return this.storage.setItem(`${this.prefix}:${key}`, value);
  }

  public removeItem(key: string) {
    return this.storage.removeItem(`${this.prefix}:${key}`);
  }
}

export default function prefixStorage(storage: Storage, prefix: string) {
  return new PrefixedStorage(storage, prefix);
}
