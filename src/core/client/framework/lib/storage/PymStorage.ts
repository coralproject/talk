import { Child, Parent } from "pym.js";
import { v1 as uuid } from "uuid";

import { globalErrorReporter } from "../errors";
import { PromisifiedStorage } from "./PromisifiedStorage";

type Pym = Child | Parent;

interface Request {
  resolve: (v: any) => void;
  reject: (v: any) => void;
}

class PymStorage implements PromisifiedStorage {
  /** Instance to pym */
  private pym: Pym;

  /** Requested storage type */
  private type: string;

  /** A Map of requestID => Request */
  private requests: Record<string, Request> = {};

  /** Requests method with parameters over pym. */
  private call<T>(
    method: string,
    parameters: Record<string, any> = {}
  ): Promise<T> {
    const id = uuid();
    return new Promise((resolve, reject) => {
      this.requests[id] = { resolve, reject };

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug(`pymStorage.${this.type}.request`, {
          id,
          method,
          parameters,
        });
      }

      this.pym.sendMessage(
        `pymStorage.${this.type}.request`,
        JSON.stringify({
          id,
          method,
          parameters,
        })
      );
    });
  }

  /** Listen to pym responses */
  private listen() {
    // Receive successful responses.
    this.pym.onMessage(`pymStorage.${this.type}.response`, (msg: string) => {
      const { id, result } = JSON.parse(msg);

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug(`pymStorage.${this.type}.response`, { id, result });
      }

      if (id in this.requests) {
        this.requests[id].resolve(result);
        delete this.requests[id];
      } else {
        // eslint-disable-next-line no-console
        globalErrorReporter.report(
          `pymStorage.${this.type}.response for missing request: ${id}`
        );
      }
    });

    // Receive error responses.
    this.pym.onMessage(`pymStorage.${this.type}.error`, (msg: string) => {
      const { id, error } = JSON.parse(msg);

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug(`pymStorage.${this.type}.error`, { id, error });
      }

      if (id in this.requests) {
        this.requests[id].reject(new Error(error));
        delete this.requests[id];
      } else {
        globalErrorReporter.report(
          `pymStorage.${this.type}.error for missing request: ${id}`
        );
      }
    });
  }

  constructor(pym: Pym, type: string) {
    this.pym = pym;
    this.type = type;
    this.listen();
  }

  public get length() {
    return this.call<number>("length");
  }
  public key(n: number) {
    return this.call<string | null>("key", { n });
  }
  public clear() {
    return this.call<void>("clear");
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
 *
 * @param  {string} pym  pym
 * @returns {object} storage
 */
export default function createPymStorage(
  pym: Pym,
  type: "localStorage" | "sessionStorage" | "indexedDB"
): PymStorage {
  return new PymStorage(pym, type);
}
