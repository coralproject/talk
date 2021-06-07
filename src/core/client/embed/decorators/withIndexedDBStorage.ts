import { Decorator } from "./types";

const withIndexedDBStorage = (dbName = "coral:keyvalue"): Decorator => (
  pym
) => {
  let db: IDBDatabase;
  if ("indexedDB" in window) {
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

  pym.onMessage(`pymStorage.indexedDB.request`, (msg: any) => {
    const { id, method, parameters } = JSON.parse(msg);
    const { key, value } = parameters;

    // Variable for the method return value.
    let request: IDBRequest<any>;

    const sendError = (error: string) => {
      // eslint-disable-next-line no-console
      console.error(error);
      pym.sendMessage(
        `pymStorage.indexedDB.error`,
        JSON.stringify({ id, error })
      );
    };

    if (!db) {
      sendError(`IndexedDB not supported.`);
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
          sendError(`key() not supported`);
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
      pym.sendMessage(
        `pymStorage.indexedDB.response`,
        JSON.stringify({ id, result: (event.target as any).result })
      );
    };
  });
};

export default withIndexedDBStorage;
