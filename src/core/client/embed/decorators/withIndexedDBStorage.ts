import { Decorator } from "./types";

// Workaround. See https://twitter.com/feross/status/1404569098294501380.
const idbWorkaround = window.indexedDB;
// eslint-disable-next-line no-unused-expressions
typeof idbWorkaround;

const withIndexedDBStorage = (dbName = "coral:keyvalue"): Decorator => (
  pym,
  postMessage,
  indexedDB = window.indexedDB
) => {
  let db: IDBDatabase;
  if (indexedDB) {
    const request = indexedDB.open(dbName, 1);
    request.onerror = function (event) {
      // eslint-disable-next-line no-console
      console.error(this.error);
    };
    request.onsuccess = (event) => {
      db = request.result;
    };
    request.onupgradeneeded = (event) => {
      request.result.createObjectStore("keyvalue");
    };
  }

  postMessage.on(
    `postMessageStorage.indexedDB.request`,
    ({ id, method, parameters }) => {
      const { key, value } = parameters;

      // Variable for the method return value.
      let request: IDBRequest<any>;

      const sendError = (error: string) => {
        // eslint-disable-next-line no-console
        console.error(error);
        postMessage.send(`postMessageStorage.indexedDB.error`, { id, error });
      };

      if (!db) {
        if (indexedDB) {
          sendError(`IndexedDB not yet initialized.`);
        } else {
          sendError(`IndexedDB not supported.`);
        }
      }

      try {
        switch (method) {
          case "setItem":
            request = db
              .transaction("keyvalue", "readwrite")
              .objectStore("keyvalue")
              .put(value, key);
            break;
          case "getItem":
            request = db
              .transaction("keyvalue", "readonly")
              .objectStore("keyvalue")
              .get(key);
            break;
          case "removeItem":
            request = db
              .transaction("keyvalue", "readwrite")
              .objectStore("keyvalue")
              .delete(key);
            break;
          case "key":
            // This could be implemented, but is not very efficient.
            sendError(`key() not implemented`);
            return;
          case "length":
            request = db
              .transaction("keyvalue", "readonly")
              .objectStore("keyvalue")
              .count();
            break;
          case "clear":
            request = db
              .transaction("keyvalue", "readwrite")
              .objectStore("keyvalue")
              .clear();
            break;
          default:
            sendError(`Unknown method ${method}`);
            return;
        }
      } catch (err) {
        sendError(err.toString());
        return;
      }
      request.onerror = function () {
        if (this.error) {
          sendError(this.error.toString());
        } else {
          sendError("Uknown error");
        }
      };
      request.onsuccess = function (event) {
        let result = (event.target as any).result;
        if (method === "setItem") {
          result = undefined;
        } else if (method === "getItem" && result === undefined) {
          result = null;
        }
        postMessage.send(`postMessageStorage.indexedDB.response`, {
          id,
          result,
        });
      };
    }
  );
};

export default withIndexedDBStorage;
