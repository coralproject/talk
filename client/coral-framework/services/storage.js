
function getStorage(type) {
  let storage = window[type], x = '__storage_test__';
  try {
    storage.setItem(x, x);
    storage.removeItem(x);
  } catch (e) {
    const ignore = (
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
