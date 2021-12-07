import { createInMemoryStorage } from "coral-framework/lib/storage";

import { prefixStorage } from "../utils";
import { DecoratorLegacy } from "./types";

const withPostMessageStorage = (
  storage: Storage | null,
  type: "localStorage" | "sessionStorage",
  prefix = "coral:"
): DecoratorLegacy => (pym, postMessage) => {
  const prefixedStorage = storage
    ? prefixStorage(storage, prefix)
    : createInMemoryStorage();

  postMessage.on(
    `postMessageStorage.${type}.request`,
    ({ id, method, parameters }) => {
      const { n, key, value } = parameters;

      // Variable for the method return value.
      let result;

      const sendError = (error: string) => {
        // eslint-disable-next-line no-console
        console.error(error);
        postMessage.send(`postMessageStorage.${type}.error`, { id, error });
      };

      try {
        switch (method) {
          case "setItem":
            result = prefixedStorage.setItem(key, value);
            break;
          case "getItem":
            result = prefixedStorage.getItem(key);
            break;
          case "removeItem":
            result = prefixedStorage.removeItem(key);
            break;
          case "key":
            result = prefixedStorage.key(n);
            break;
          case "length":
            result = prefixedStorage.length;
            break;
          case "clear":
            result = prefixedStorage.clear();
            break;
          default:
            sendError(`Unknown method ${method}`);
            return;
        }
      } catch (err) {
        sendError(err.toString());
        return;
      }

      postMessage.send(`postMessageStorage.${type}.response`, { id, result });
    }
  );
};

export default withPostMessageStorage;
