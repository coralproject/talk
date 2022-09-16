import mockConsole from "jest-mock-console";
import { fakeServer, stub } from "sinon";
import timekeeper from "timekeeper";

import * as Coral from "../";

(global as any).__webpack_public_path__ = "";

/* eslint-disable no-console */

describe("Basic integration test", () => {
  const container: HTMLElement = document.createElement("div");
  beforeEach(() => {
    timekeeper.freeze(new Date(1589310827300));
    container.id = "basic-integration-test-id";
    document.body.appendChild(container);
  });
  afterEach(() => {
    timekeeper.reset();
    delete (window as any).CoralStream;
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });
  it("should embed Coral", () => {
    const restoreConsole = mockConsole();
    const server = fakeServer.create();
    try {
      server.respondImmediately = true;
      server.autoRespond = true;
      server.respondWith("GET", "/embed/bootstrap", [
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({
          assets: {
            css: [{ src: "assets/css/stream.css" }],
            js: [{ src: "assets/js/stream.js" }],
          },
          staticConfig: {},
        }),
      ]);
      const CoralEmbedStream = Coral.createStreamEmbed({
        id: "basic-integration-test-id",
      });
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.error).not.toHaveBeenCalled();
      restoreConsole();
      CoralEmbedStream.render();

      expect(document.head.innerHTML).toMatchInlineSnapshot(
        `"<link rel=\\"preload\\" href=\\"http://localhost/assets/css/stream.css\\"><link rel=\\"preload\\" href=\\"http://localhost/assets/js/stream.js\\"><script src=\\"http://localhost/assets/js/stream.js\\"></script>"`
      );

      const scriptElement = document.head.querySelector("script");
      expect(scriptElement).not.toBeNull();

      let args;
      const attachStub = stub().callsFake((a) => {
        args = a;
      });

      (window as any).CoralStream = {
        attach: attachStub,
      };
      scriptElement!.onload!({} as any);
      expect(attachStub.called).toBe(true);
      expect(args).toMatchInlineSnapshot(`
        Object {
          "accessToken": undefined,
          "amp": undefined,
          "commentID": undefined,
          "containerClassName": undefined,
          "cssAssets": Array [
            "http://localhost/assets/css/stream.css",
          ],
          "customCSSURL": undefined,
          "customFontsCSSURL": undefined,
          "customScrollContainer": undefined,
          "defaultFontsCSSURL": undefined,
          "disableDefaultFonts": undefined,
          "element": <div
            id="basic-integration-test-id"
          />,
          "eventEmitter": EventEmitter {
            "_all": Array [
              [Function],
            ],
            "_conf": Object {
              "delimiter": ".",
              "maxListeners": 1000,
              "wildcard": true,
            },
            "_events": Object {},
            "_maxListeners": 1000,
            "_newListener": false,
            "_removeListener": false,
            "delimiter": ".",
            "listenerTree": Object {
              "commentCount": Object {
                "_listeners": [Function],
              },
              "ready": Object {
                "_listeners": [Function],
              },
              "stream": Object {
                "setCommentID": Object {
                  "_listeners": [Function],
                },
              },
            },
            "verboseMemoryLeak": false,
            "wildcard": true,
          },
          "graphQLSubscriptionURI": undefined,
          "locale": undefined,
          "refreshAccessToken": undefined,
          "rootURL": "http://localhost",
          "staticConfig": Object {},
          "storyID": undefined,
          "storyMode": undefined,
          "storyURL": "http://localhost/",
          "version": "Test",
        }
      `);
    } finally {
      restoreConsole();
      server.restore();
    }
  });
  it("should use canonical link", () => {
    const restoreConsole = mockConsole();
    const server = fakeServer.create();
    try {
      server.respondImmediately = true;
      server.autoRespond = true;
      server.respondWith("GET", "/embed/bootstrap", [
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({
          assets: {
            css: [{ src: "http://localhost/assets/css/stream.css" }],
            js: [{ src: "http://localhost/assets/js/stream.js" }],
          },
          staticConfig: {},
        }),
      ]);
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = "http://localhost/canonical";
      document.head.appendChild(link);
      const CoralEmbedStream = Coral.createStreamEmbed({
        id: "basic-integration-test-id",
      });
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
      restoreConsole();
      CoralEmbedStream.render();

      const scriptElement = document.head.querySelector("script");
      expect(scriptElement).not.toBeNull();

      let args: any;
      const attachStub = stub().callsFake((a) => {
        args = a;
      });

      (window as any).CoralStream = {
        attach: attachStub,
      };
      scriptElement!.onload!({} as any);
      expect(attachStub.called).toBe(true);
      expect(args && args.storyURL).toBe("http://localhost/canonical");
    } finally {
      restoreConsole();
      server.restore();
    }
  });
  it("should remove embed", () => {
    const server = fakeServer.create();
    try {
      server.respondImmediately = true;
      server.autoRespond = true;
      server.respondWith("GET", "/embed/bootstrap", [
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({
          assets: {
            css: [{ src: "http://localhost/assets/css/stream.css" }],
            js: [{ src: "http://localhost/assets/js/stream.js" }],
          },
          staticConfig: {},
        }),
      ]);
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = "http://localhost/canonical";
      document.head.appendChild(link);
      const CoralEmbedStream = Coral.createStreamEmbed({
        id: "basic-integration-test-id",
      });
      CoralEmbedStream.render();

      const scriptElement = document.head.querySelector("script");
      expect(scriptElement).not.toBeNull();

      const removeStub = stub();
      (window as any).CoralStream = {
        attach: () => {},
        remove: removeStub,
      };
      scriptElement!.onload!({} as any);
      CoralEmbedStream.remove();
      expect(removeStub.called).toBe(true);
    } finally {
      server.restore();
    }
  });
});
