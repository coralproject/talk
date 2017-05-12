let available, error;

function storageAvailable(type) {
  try {
    let storage = window[type], x = '__storage_test__';
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

export function getItem(item = '') {
  if (typeof available === 'undefined') {
    available = storageAvailable('localStorage');
  }

  if (available) {
    return localStorage.getItem(item);
  } else {
    console.error(`Cannot get from localStorage. localStorage is not available. ${error}`);
  }
}

export function setItem(item = '', value) {
  if (typeof available === 'undefined') {
    available = storageAvailable('localStorage');
  }

  if (available) {
    return localStorage.setItem(item, value);
  } else {
    console.error(`Cannot set localStorage. localStorage is not available. ${error}`);
  }
}

export function clear() {
  if (available) {
    return localStorage.clear();
  } else {
    console.error(`Cannot clear localStorage. localStorage is not available. ${error}`);
  }
}
