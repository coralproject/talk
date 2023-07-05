import { PromisifiedStorage } from "./PromisifiedStorage";

const objectStoreName = "keyvalue";

/**
 * IndexedDBStorage decorates a Storage and prefixes keys in
 * getItem, setItem and removeItem with given prefix.
 */
class IndexedDBStorage implements PromisifiedStorage<any> {
  private db: IDBDatabase;
  private pendingCalls: Array<() => void> = [];
  private dbName: string;

  constructor(name: string, indexedDB: IDBFactory) {
    this.dbName = name;
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

  private _requestToPromise<T>(callback: () => IDBRequest<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const call = () => {
        const request = callback();
        request.onsuccess = function (event) {
          resolve((event.target as any).result);
        };
        request.onerror = function (event) {
          if (this.error) {
            reject(this.error);
          }
        };
      };
      if (!this.db) {
        this.pendingCalls.push(call);
        return;
      }
      call();
    });
  }

  public get length(): Promise<number> {
    return this._requestToPromise(() =>
      this.db
        .transaction(objectStoreName, "readonly")
        .objectStore(objectStoreName)
        .count()
    );
  }

  public clear(): Promise<void> {
    return this._requestToPromise(() =>
      this.db
        .transaction(objectStoreName, "readonly")
        .objectStore(objectStoreName)
        .clear()
    );
  }

  public key(n: number): Promise<any | null> {
    // This could be implemented, but is not very efficient.
    throw new Error("Not implement");
  }

  public getItem<T>(key: string): Promise<T> {
    return this._requestToPromise(() =>
      this.db
        .transaction(objectStoreName, "readonly")
        .objectStore(objectStoreName)
        .get(key)
    ).then((val) => (val === undefined ? null : val));
  }

  public setItem<T>(key: string, value: T): Promise<void> {
    return this._requestToPromise<void>(
      () =>
        this.db
          .transaction(objectStoreName, "readwrite")
          .objectStore(objectStoreName)
          .put(value, key) as any
    ).then(() => {});
  }

  public removeItem(key: string): Promise<void> {
    return this._requestToPromise(() =>
      this.db
        .transaction(objectStoreName, "readwrite")
        .objectStore(objectStoreName)
        .delete(key)
    );
  }
}

export default function createIndexedDBStorage(
  name = "storage",
  indexedDB: IDBFactory
): PromisifiedStorage<any> {
  if (!indexedDB) {
    throw new Error("IndexedDB not available");
  }
  return new IndexedDBStorage(`coral:${name}`, indexedDB);
}
