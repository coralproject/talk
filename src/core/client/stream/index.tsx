import * as CoralStream from "./stream";

declare global {
  interface Window {
    CoralStream: typeof CoralStream;
  }
}

// eslint-disable-next-line no-restricted-globals
window.CoralStream = CoralStream;
