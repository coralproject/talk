import { prefixStorage } from "../utils";
import { Decorator } from "./types";

const withPymStorage = (
  storage: Storage,
  type: "localStorage" | "sessionStorage",
  prefix = "coral:"
): Decorator => pym => {
  pym.onMessage(`pymStorage.${type}.request`, (msg: any) => {
    const { id, method, parameters } = JSON.parse(msg);
    const { n, key, value } = parameters;
    const prefixedStorage = prefixStorage(storage, prefix);

    // Variable for the method return value.
    let result;

    const sendError = (error: string) => {
      // tslint:disable-next-line:no-console
      console.error(error);
      pym.sendMessage(
        `pymStorage.${type}.error`,
        JSON.stringify({ id, error })
      );
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

    pym.sendMessage(
      `pymStorage.${type}.response`,
      JSON.stringify({ id, result })
    );
  });
};

export default withPymStorage;
