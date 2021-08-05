import { PromisifiedStorage } from "./PromisifiedStorage";

// By @loganfsmyth on https://stackoverflow.com/questions/37234191/how-do-you-implement-a-racetosuccess-helper-given-a-list-of-promises
function getFirstResolvingPromise<T>(promises: Array<Promise<T>>) {
  return Promise.all(
    promises.map((p) => {
      // If a request fails, count that as a resolution so it will keep
      // waiting for other possible successes. If a request succeeds,
      // treat it as a rejection so Promise.all immediately bails out.
      return p.then(
        (val) => Promise.reject(val),
        (err) => Promise.resolve(err)
      );
    })
  ).then(
    // If '.all' resolved, we've just got an array of errors.
    (errors) => Promise.reject(errors),
    // If '.all' rejected, we've got the result we wanted.
    (val) => Promise.resolve(val)
  );
}

/**
 * CombinedPromisfiedStorage.
 */
class CombinedPromisifiedStorage implements PromisifiedStorage {
  private storageA: PromisifiedStorage;
  private storageB: PromisifiedStorage;

  constructor(storageA: PromisifiedStorage, storageB: PromisifiedStorage) {
    this.storageA = storageA;
    this.storageB = storageB;
  }

  public get length() {
    return getFirstResolvingPromise([
      this.storageA.length,
      this.storageB.length,
    ]);
  }

  public clear() {
    return getFirstResolvingPromise([
      this.storageA.clear(),
      this.storageB.clear(),
    ]);
  }

  public key(n: number) {
    return getFirstResolvingPromise([
      this.storageA.key(n),
      this.storageB.key(n),
    ]);
  }

  public getItem(key: string) {
    return getFirstResolvingPromise([
      this.storageA.getItem(key),
      this.storageB.getItem(key),
    ]);
  }

  public setItem(key: string, value: string) {
    return getFirstResolvingPromise([
      this.storageA.setItem(key, value),
      this.storageB.setItem(key, value),
    ]);
  }

  public removeItem(key: string) {
    return getFirstResolvingPromise([
      this.storageA.removeItem(key),
      this.storageB.removeItem(key),
    ]);
  }
}

export default function combinePromisifiedStorage(
  storageA: PromisifiedStorage,
  storageB: PromisifiedStorage
) {
  return new CombinedPromisifiedStorage(storageA, storageB);
}
