import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({adapter: new Adapter()});

// Storage Mock

// TODO: If our code is written well, there shouldn't be a hardcoded dependency
// to the local storage, and this global mock wouldn't be needed.

function storageMock() {
  let storage = {};

  return {
    setItem: function(key, value) {
      storage[key] = value || '';
    },
    getItem: function(key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function(i) {
      let keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}

// mock the localStorage
window.localStorage = storageMock();

// mock the sessionStorage
window.sessionStorage = storageMock();
