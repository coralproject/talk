import startsWith from "coral-common/utils/startsWith";

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

  public get length() {
    let count = 0;
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && startsWith(key, this.prefix)) {
        count++;
      }
    }
    return count;
  }

  public clear() {
    const toBeDeleted = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && startsWith(key, this.prefix)) {
        toBeDeleted.push(key);
      }
    }
    toBeDeleted.forEach((key) => this.storage.removeItem(key));
  }

  public key(n: number) {
    let count = 0;
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && startsWith(key, this.prefix)) {
        if (count === n) {
          return key;
        }
        count++;
      }
    }
    return null;
  }

  public getItem(key: string) {
    return this.storage.getItem(`${this.prefix}${key}`);
  }

  public setItem(key: string, value: string) {
    return this.storage.setItem(`${this.prefix}${key}`, value);
  }

  public removeItem(key: string) {
    return this.storage.removeItem(`${this.prefix}${key}`);
  }
}

export default function prefixStorage(storage: Storage, prefix: string) {
  return new PrefixedStorage(storage, prefix);
}
