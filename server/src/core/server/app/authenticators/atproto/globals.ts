import { Headers, Request, Response } from "undici";

/**
 * installFetchClasses makes the WHATWG Headers, Request and Response classes
 * available as globals when they are missing.
 *
 * Coral runs with `--no-experimental-fetch` (see the server's package.json and
 * the Dockerfile), which removes Node's built-in fetch along with these
 * classes. The atproto OAuth client is given undici's fetch directly, but its
 * internals reference these classes by their global names when they load, so
 * they have to exist before the library is imported. The global fetch is left
 * disabled, so the rest of Coral keeps using node-fetch as before.
 */
export function installFetchClasses() {
  const g = globalThis as Record<string, unknown>;

  if (typeof g.Headers === "undefined") {
    g.Headers = Headers;
  }
  if (typeof g.Request === "undefined") {
    g.Request = Request;
  }
  if (typeof g.Response === "undefined") {
    g.Response = Response;
  }
}
