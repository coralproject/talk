import uuid from 'uuid/v4';

function getStorage(type) {
  let storage = window[type],
    x = '__storage_test__';
  try {
    storage.setItem(x, x);
    storage.removeItem(x);
  } catch (e) {
    const ignore =
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox

        e.code === 1014 ||
        // test name field too, because code might not be present

        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
    if (!ignore) {
      console.warning(e); // eslint-disable-line
      return null;
    }
  }
  return storage;
}

/**
 * createStorage returns a localStorage wrapper if available
 * @return {Object}  localStorage wrapper
 */
export function createStorage() {
  return getStorage('localStorage');
}

/**
 * Creates a storage that relay requests over to pym.
 * This is the counterpart of `connectStorageToPym`.
 * @param  {string} pym  pym
 * @return {Object} storage
 */
export function createPymStorage(pym) {
  // A Map of requestID => {resolve, reject}
  const requests = {};

  // Requests method with parameters over pym.
  const call = (method, parameters) => {
    const id = uuid();
    return new Promise((resolve, reject) => {
      requests[id] = { resolve, reject };
      pym.sendMessage(
        'pymStorage.request',
        JSON.stringify({ id, method, parameters })
      );
    });
  };

  // Receive successful responses.
  pym.onMessage('pymStorage.response', msg => {
    const { id, result } = JSON.parse(msg);
    requests[id].resolve(result);
    delete requests[id];
  });

  // Receive error responses.
  pym.onMessage('pymStorage.error', msg => {
    const { id, error } = JSON.parse(msg);
    requests[id].reject(error);
    delete requests[id];
  });

  return {
    setItem: (key, value) => call('setItem', { key, value }),
    getItem: (key, value) => call('getItem', { key, value }),
    removeItem: key => call('removeItem', { key }),
  };
}

/**
 * Listens to `pym` and relay storage requests to `storage`.
 * This is the counterpart of `createPymStorage`.
 * @param  {Object} storage  storage to perform requests on
 * @param  {Object} pym      pym to listen to storage requests
 * @param  {string} prefix   namespace requests by prepending a prefix to the keys
 */
export function connectStorageToPym(storage, pym, prefix = 'talkPymStorage:') {
  pym.onMessage('pymStorage.request', msg => {
    const { id, method, parameters } = JSON.parse(msg);
    const { key, value } = parameters;
    const prefixedKey = `${prefix}${key}`;

    // Variable for the method return value.
    let result;

    const sendError = error => {
      console.error(error);
      pym.sendMessage('pymStorage.error', JSON.stringify({ id, error }));
    };

    try {
      switch (method) {
        case 'setItem':
          result = storage.setItem(prefixedKey, value);
          break;
        case 'getItem':
          result = storage.getItem(prefixedKey);
          break;
        case 'removeItem':
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

    pym.sendMessage('pymStorage.response', JSON.stringify({ id, result }));
  });
}
