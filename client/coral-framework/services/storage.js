import uuid from 'uuid/v4';

function testStorage(storage) {
  const key = '__storage_test__';

  // Create a unique test value.
  const expectedValue = String(Date.now());

  // Try to set, get, and remove that item.
  storage.setItem(key, expectedValue);
  const canSetGet = expectedValue === storage.getItem(key);
  storage.removeItem(key);

  return canSetGet;
}

// InMemoryStorage is a dumb implementation of the Storage interface that will
// not persist the data at all. It implements the Storage interface found:
//
// https://developer.mozilla.org/en-US/docs/Web/API/Storage
//
class InMemoryStorage {
  constructor() {
    this.storage = {};
  }

  get length() {
    return Object.keys(this.storage).length;
  }

  key(n) {
    if (this.length <= n) {
      return undefined;
    }

    return this.storage[Object.keys(this.storage)[n]];
  }

  getItem(key) {
    return this.storage[key];
  }

  setItem(key, value) {
    this.storage[key] = value;

    try {
      // Test sessionStorage. We could have been given access recently.
      const canSetGet = testStorage(sessionStorage);

      if (canSetGet) {
        sessionStorage.setItem(key, value);
        console.log(
          'Attempt to persist InMemoryStorage value to sessionStorage succeeded'
        );
      }
    } catch (err) {
      console.warn(
        'Attempt to persist InMemoryStorage value to sessionStorage failed',
        err
      );
    }
  }

  removeItem(key) {
    delete this.storage[key];

    try {
      // Test sessionStorage. We could have been given access recently.
      const canSetGet = testStorage(sessionStorage);

      if (canSetGet) {
        sessionStorage.removeItem(key);
        console.log(
          'Attempt to persist InMemoryStorage delete to sessionStorage succeeded'
        );
      }
    } catch (err) {
      console.warn(
        'Attempt to persist InMemoryStorage delete to sessionStorage failed',
        err
      );
    }
  }
}

// getStorage will test to see if the requested storage type is available, if it
// is not, it will try sessionStorage, and if that is also not available, it
// will fallback to InMemoryStorage.
function getStorage(type) {
  let storage;
  try {
    // Get the desired storage from the window.
    storage = window[type];

    // Test the storage.
    const canSetGet = testStorage(storage);

    // If we can set/get then use that storage.
    if (canSetGet) {
      console.log('Access to', type, 'is available');
      return storage;
    } else {
      console.warn(
        'Failed to set/get on',
        type,
        'falling back to InMemoryStorage'
      );
    }
  } catch (err) {
    // When third party cookies are disabled, session storage is readable/
    // writable, but localStorage is not. Try to get the sessionStorage to use.
    if (type !== 'sessionStorage') {
      console.warn('Could not access', type, 'trying sessionStorage', err);
      return getStorage('sessionStorage');
    }

    console.warn(
      'Could not access',
      type,
      'falling back to InMemoryStorage',
      err
    );
  }

  // No acceptable storage could be found, returning the InMemoryStorage.
  return new InMemoryStorage();
}

/**
 * createStorage returns a localStorage wrapper if available
 * @return {Object}  localStorage wrapper
 */
export function createStorage(type = 'localStorage') {
  return getStorage(type);
}

/**
 * Creates a storage that relay requests over to pym.
 * This is the counterpart of `connectStorageToPym`.
 * @param  {string} pym  pym
 * @return {Object} storage
 */
export function createPymStorage(pym, type = 'localStorage') {
  // A Map of requestID => {resolve, reject}
  const requests = {};

  // Requests method with parameters over pym.
  const call = (method, parameters) => {
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
  pym.onMessage(`pymStorage.${type}.response`, msg => {
    const { id, result } = JSON.parse(msg);
    requests[id].resolve(result);
    delete requests[id];
  });

  // Receive error responses.
  pym.onMessage(`pymStorage.${type}.error`, msg => {
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
export function connectStorageToPym(
  storage,
  pym,
  type = 'localStorage',
  prefix = 'talkPymStorage:'
) {
  pym.onMessage(`pymStorage.${type}.request`, msg => {
    const { id, method, parameters } = JSON.parse(msg);
    const { key, value } = parameters;
    const prefixedKey = `${prefix}${key}`;

    // Variable for the method return value.
    let result;

    const sendError = error => {
      console.error(error);
      pym.sendMessage(
        `pymStorage.${type}.error`,
        JSON.stringify({ id, error })
      );
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

    pym.sendMessage(
      `pymStorage.${type}.response`,
      JSON.stringify({ id, result })
    );
  });
}
