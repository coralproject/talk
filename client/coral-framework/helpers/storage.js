let available, error;

function storageAvailable(type) {
  let storage = window[type], x = '__storage_test__';
  try {
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    error = e;
    return (
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
      storage.length !== 0
    );
  }
}

function lazyCheckStorage() {
  if (typeof available === 'undefined') {
    available = storageAvailable('localStorage');
  }
}

export function getItem(item = '') {
  console.log(`asking for item ${item}`);
  lazyCheckStorage();

  if (available) {
    return localStorage.getItem(item);
  } else {
    console.error(
      `Cannot get from localStorage. localStorage is not available. ${error}`
    );
  }
}

export function setItem(item = '', value) {
  lazyCheckStorage();

  if (available) {
    return localStorage.setItem(item, value);
  } else {
    console.error(
      `Cannot set localStorage. localStorage is not available. ${error}`
    );
  }
}

export function removeItem(item = '') {
  lazyCheckStorage();

  if (available) {
    return localStorage.removeItem(item);
  } else {
    console.error(
      `Cannot remove item from localStorage. localStorage is not available. ${error}`
    );
  }
}

export function clear() {
  lazyCheckStorage();

  if (available) {
    return localStorage.clear();
  } else {
    console.error(
      `Cannot clear localStorage. localStorage is not available. ${error}`
    );
  }
}

// Enable this to debug WEB Storage events
// window.addEventListener('storage', function(e) {
//   const msg = `${e.key} " was changed in page ${e.url} from ${e.oldValue} to ${e.newValue}`;
//   console.log(msg);
// });
