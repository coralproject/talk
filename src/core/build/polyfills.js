require("core-js/stable");
require("regenerator-runtime/runtime");
require("whatwg-fetch");
require("proxy-polyfill");
require("intersection-observer");
if ("NodeList" in window && !NodeList.prototype.forEach) {
  // eslint-disable-next-line no-console
  console.info("polyfill for IE11");
  NodeList.prototype.forEach = function(callback, thisArg) {
    thisArg = thisArg || window;
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}
