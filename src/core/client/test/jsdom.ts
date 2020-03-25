import { JSDOM } from "jsdom";

declare const global: any;

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

// tiny shim for getSelection for the RTE.

function copyProps(src: any, target: any) {
  const props = Object.getOwnPropertyNames(src)
    .filter((prop) => typeof target[prop] === "undefined")
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

global.window.getSelection = () =>
  ({
    addRange() {},
    removeAllRanges() {},
  } as any);
global.window.resizeTo = () => {};
