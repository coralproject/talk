import { Child, Parent } from "pym.js";
import uuid from "uuid/v4";
import { Storage } from "./interface";

type Pym = Child | Parent;

/**
 * Creates a storage that put requests onto pym.
 * This is the counterpart of `connectStorageToPym`.
 * @param  {string} pym  pym
 * @return {Object} storage
 */
export default function createPymStorage(
  pym: Pym,
  type: "localStorage" | "sessionStorage"
): Storage {
  // A Map of requestID => {resolve, reject}
  const requests: Record<
    string,
    { resolve: ((v: any) => void); reject: ((v: any) => void) }
  > = {};

  // Requests method with parameters over pym.
  const call = <T>(
    method: string,
    parameters: { key: string; value?: string }
  ): Promise<T> => {
    const id = uuid();
    return new Promise((resolve, reject) => {
      requests[id] = { resolve, reject };
      pym.sendMessage(
        `pymStorage.${type}.request`,
        JSON.stringify({ id, method, parameters })
      );
    });
  };

  // Receive successful responses.
  pym.onMessage(`pymStorage.${type}.response`, (msg: string) => {
    const { id, result } = JSON.parse(msg);
    requests[id].resolve(result);
    delete requests[id];
  });

  // Receive error responses.
  pym.onMessage(`pymStorage.${type}.error`, (msg: string) => {
    const { id, error } = JSON.parse(msg);
    requests[id].reject(new Error(error));
    delete requests[id];
  });

  return {
    setItem: (key: string, value: string) => call("setItem", { key, value }),
    getItem: (key: string) => call("getItem", { key }),
    removeItem: (key: string) => call("removeItem", { key }),
  };
}
