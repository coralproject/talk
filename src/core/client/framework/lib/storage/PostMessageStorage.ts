import { v1 as uuid } from "uuid";

import { globalErrorReporter } from "../errors";
import { PostMessageService } from "../postMessage";
import { PromisifiedStorage } from "./PromisifiedStorage";

interface Request {
  resolve: (v: any) => void;
  reject: (v: any) => void;
}

class PostMessageStorage implements PromisifiedStorage {
  /** Instance to postMessage */
  private postMessage: PostMessageService;

  /** Requested storage type */
  private type: string;

  /** A Map of requestID => Request */
  private requests: Record<string, Request> = {};

  /** Requests method with parameters over postMessage. */
  private call<T>(
    method: string,
    parameters: Record<string, any> = {}
  ): Promise<T> {
    const id = uuid();
    return new Promise((resolve, reject) => {
      this.requests[id] = { resolve, reject };

      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.debug(`postMessageStorage.${this.type}.request`, {
          id,
          method,
          parameters,
        });
      }

      this.postMessage.send(`postMessageStorage.${this.type}.request`, {
        id,
        method,
        parameters,
      });
    });
  }

  /** Listen to postMessage responses */
  private listen() {
    // Receive successful responses.
    this.postMessage.on(
      `postMessageStorage.${this.type}.response`,
      ({ id, result }) => {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.debug(`postMessageStorage.${this.type}.response`, {
            id,
            result,
          });
        }

        if (id in this.requests) {
          this.requests[id].resolve(result);
          delete this.requests[id];
        } else {
          // eslint-disable-next-line no-console
          globalErrorReporter.report(
            `postMessageStorage.${this.type}.response for missing request: ${id}`
          );
        }
      }
    );

    // Receive error responses.
    this.postMessage.on(
      `postMessageStorage.${this.type}.error`,
      ({ id, error }) => {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.debug(`postMessageStorage.${this.type}.error`, { id, error });
        }

        if (id in this.requests) {
          this.requests[id].reject(new Error(error));
          delete this.requests[id];
        } else {
          globalErrorReporter.report(
            `postMessageStorage.${this.type}.error for missing request: ${id}`
          );
        }
      }
    );
  }

  constructor(postMessage: PostMessageService, type: string) {
    this.postMessage = postMessage;
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
 * Creates a storage that put requests onto postmessage.
 *
 * @param  {string} postMessage PostMessageService
 * @returns {object} storage
 */
export default function createPostMessageStorage(
  postMessage: PostMessageService,
  type: "localStorage" | "sessionStorage" | "indexedDB"
): PostMessageStorage {
  return new PostMessageStorage(postMessage, type);
}
