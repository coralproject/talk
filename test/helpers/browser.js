/* eslint-env browser */

const jsdom = require('jsdom').jsdom;
const fs = require('fs');
const path = require('path');

// Storage Mock
function storageMock() {
  const storage = {};

  return {
    setItem: function(key, value) {
      storage[key] = value || '';
    },
    getItem: function(key) {
      return storage[key] || null;
    },
    removeItem: function(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}

global.document = jsdom(fs.readFileSync(path.resolve(__dirname, 'index.test.html')));
global.window = document.defaultView;

// these lines are required for react-mdl
global.window.CustomEvent = undefined;
require('react-mdl/extra/material');

global.Element = global.window.Element;

global.navigator = {
  userAgent: 'node.js'
};

global.documentRef = document;
global.localStorage = {};
global.sessionStorage = storageMock();
global.XMLHttpRequest = storageMock();

global.Headers = function(headers) {
  return headers;
};
