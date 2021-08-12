import { PromisifiedStorage } from "./PromisifiedStorage";

import getFirstResolvingPromise from "coral-common/utils/getFirstResolvingPromise";

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
