import { Child, Parent } from "pym.js";
import uuid from "uuid/v4";

type Pym = Child | Parent;

export interface PymStorage {
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

class PymStorageImpl implements PymStorage {
  private pym: Pym;
  private type: string;

  /** A Map of requestID => {resolve, reject} */
  private requests: Record<
    string,
    { resolve: ((v: any) => void); reject: ((v: any) => void) }
  > = {};

  // Requests method with parameters over pym.
  private call<T>(
    method: string,
    parameters: { key: string; value?: string }
  ): Promise<T> {
    const id = uuid();
    return new Promise((resolve, reject) => {
      this.requests[id] = { resolve, reject };
      this.pym.sendMessage(
        `pymStorage.${this.type}.request`,
        JSON.stringify({ id, method, parameters })
      );
    });
  }

  private listen() {
    // Receive successful responses.
    this.pym.onMessage(`pymStorage.${this.type}.response`, (msg: string) => {
      const { id, result } = JSON.parse(msg);
      this.requests[id].resolve(result);
      delete this.requests[id];
    });

    // Receive error responses.
    this.pym.onMessage(`pymStorage.${this.type}.error`, (msg: string) => {
      const { id, error } = JSON.parse(msg);
      this.requests[id].reject(new Error(error));
      delete this.requests[id];
    });
  }

  constructor(pym: Pym, type: string) {
    this.pym = pym;
    this.type = type;
    this.listen();
  }

  public setItem(key: string, value: string) {
    return this.call<void>("setItem", { key, value });
  }
  public getItem(key: string) {
    return this.call<string | null>("getItem", { key });
  }
  public removeItem(key: string) {
    return this.call<void>("removeItem", { key });
  }
}

/**
 * Creates a storage that put requests onto pym.
 * This is the counterpart of `connectStorageToPym`.
 * @param  {string} pym  pym
 * @return {Object} storage
 */
export default function createPymStorage(
  pym: Pym,
  type: "localStorage" | "sessionStorage"
): PymStorage {
  return new PymStorageImpl(pym, type);
}
