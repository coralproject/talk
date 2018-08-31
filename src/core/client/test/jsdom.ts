import { JSDOM } from "jsdom";

declare var global: any;

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

// tiny shim for getSelection for the RTE.
// tslint:disable:no-empty
window.getSelection = () =>
  ({
    addRange() {},
    removeAllRanges() {},
  } as any);
// tslint:enable:no-empty

function copyProps(src: any, target: any) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === "undefined")
    .reduce(
      (result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop),
      }),
      {}
    );
  Object.defineProperties(target, props);
}

global.window = window;
global.document = (window as any).document;
global.navigator = {
  userAgent: "node.js",
};

copyProps(window, global);
