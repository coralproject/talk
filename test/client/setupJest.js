import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });

// Storage Mock

// TODO: Some places in our code (e.g. translations) has a hardcoded dependency
// to the local storage. Fixing it and we can remove this global mock.

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
    },
  };
}

// mock the localStorage
window.localStorage = storageMock();

// mock the sessionStorage
window.sessionStorage = storageMock();
