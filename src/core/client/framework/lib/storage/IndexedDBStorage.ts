import { PromisifiedStorage } from "./PromisifiedStorage";

const objectStoreName = "keyvalue";

function attachRequestHandlers<T>(
  request: IDBRequest,
  onsuccess: (result: T) => void,
  onerror: (err: Error) => void
) {
  request.onsuccess = function (event) {
    onsuccess((event.target as any).result);
  };
  request.onerror = function (event) {
    if (this.error) {
      onerror(this.error);
    }
  };
}

/**
 * IndexedDBStorage decorates a Storage and prefixes keys in
 * getItem, setItem and removeItem with given prefix.
 */
class IndexedDBStorage implements PromisifiedStorage<any> {
  private db: IDBDatabase;
  private pendingCalls: Array<() => void> = [];
  private dbName: string;

  constructor(name: string) {
    this.dbName = name;
    if (!("indexedDB" in window)) {
      throw new Error("IndexedDB not available");
    }
    const request = indexedDB.open(this.dbName, 1);
    request.onerror = function (event) {
      // eslint-disable-next-line no-console
      console.error(this.error);
    };
    request.onsuccess = (event) => {
      this.db = request.result;
      this.pendingCalls.forEach((cb) => cb());
      this.pendingCalls = [];
    };
    request.onupgradeneeded = (event) => {
      const db = request.result;
      db.createObjectStore(objectStoreName);
    };
  }

  private _length(
    onsuccess: (result: number) => void,
    onerror: (err: Error) => void
  ) {
    const request = this.db
      .transaction(objectStoreName, "readonly")
      .objectStore(objectStoreName)
      .count();
    attachRequestHandlers(request, onsuccess, onerror);
  }

  public get length(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const callback = () => this._length(resolve, reject);
      if (!this.db) {
        this.pendingCalls.push(() => callback());
        return;
      }
      callback();
    });
  }

  private _clear(onsuccess: () => void, onerror: (err: Error) => void) {
    const request = this.db
      .transaction(objectStoreName, "readwrite")
      .objectStore(objectStoreName)
      .clear();
    attachRequestHandlers(request, onsuccess, onerror);
  }
  public clear(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const callback = () => this._clear(resolve, reject);
      if (!this.db) {
        this.pendingCalls.push(() => callback());
        return;
      }
      callback();
    });
  }

  public key(n: number): Promise<any | null> {
    throw new Error("Not implement");
  }

  private _getItem<T>(
    key: string,
    onsuccess: (result: T) => void,
    onerror: (err: Error) => void
  ) {
    const request = this.db
      .transaction(objectStoreName, "readonly")
      .objectStore(objectStoreName)
      .get(key);
    attachRequestHandlers(request, onsuccess, onerror);
  }

  public getItem<T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const callback = () => this._getItem<T>(key, resolve, reject);
      if (!this.db) {
        this.pendingCalls.push(() => callback());
        return;
      }
      callback();
    });
  }

  private _setItem<T>(
    key: string,
    value: T,
    onsuccess: () => void,
    onerror: (err: Error) => void
  ) {
    const request = this.db
      .transaction(objectStoreName, "readwrite")
      .objectStore(objectStoreName)
      .put(value, key);
    attachRequestHandlers(request, onsuccess, onerror);
  }
  public setItem<T>(key: string, value: T) {
    return new Promise<void>((resolve, reject) => {
      const callback = () => this._setItem<T>(key, value, resolve, reject);
      if (!this.db) {
        this.pendingCalls.push(() => callback());
        return;
      }
      callback();
    });
  }

  private _removeItem<T>(
    key: string,
    onsuccess: () => void,
    onerror: (err: Error) => void
  ) {
    const request = this.db
      .transaction(objectStoreName, "readwrite")
      .objectStore(objectStoreName)
      .delete(key);
    attachRequestHandlers(request, onsuccess, onerror);
  }
  public removeItem(key: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const callback = () => this._removeItem(key, resolve, reject);
      if (!this.db) {
        this.pendingCalls.push(() => callback());
        return;
      }
      callback();
    });
  }
}

export default function createIndexedDBStorage(
  name = "storage"
): PromisifiedStorage<any> {
  return new IndexedDBStorage(`coral:${name}`);
}
