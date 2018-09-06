import { Decorator } from "./types";

const withPymStorage = (
  storage: Storage,
  type: "localStorage" | "sessionStorage",
  prefix = "talkPymStorage:"
): Decorator => pym => {
  pym.onMessage(`pymStorage.${type}.request`, (msg: any) => {
    const { id, method, parameters } = JSON.parse(msg);
    const { key, value } = parameters;
    const prefixedKey = `${prefix}${key}`;

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
          result = storage.setItem(prefixedKey, value);
          break;
        case "getItem":
          result = storage.getItem(prefixedKey);
          break;
        case "removeItem":
          result = storage.removeItem(prefixedKey);
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
