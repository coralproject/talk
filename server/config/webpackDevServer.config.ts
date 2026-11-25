import fs from "fs";
import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import ignoredFiles from "react-dev-utils/ignoredFiles";
import noopServiceWorkerMiddleware from "react-dev-utils/noopServiceWorkerMiddleware";
import { Configuration } from "webpack-dev-server";

import paths from "./paths";

interface WebpackDevServerConfig {
  /** The port of the Coral server */
  serverPort: number;
  /** The port of the Webpack Dev server */
  devPort: number;
  publicPath: string;
}

export default function ({
  serverPort,
  devPort,
  publicPath,
}: WebpackDevServerConfig): Configuration {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    // Enable gzip compression of generated files.
    compress: true,
    client: {
      logging: "none",
      overlay: false,
      webSocketTransport: "ws",
      webSocketURL: {
        port: devPort,
      },
    },
    // By default WebpackDevServer serves physical files from current directory
    // in addition to all the virtual build products that it serves from memory.
    // This is confusing because those files won’t automatically be available in
    // production build folder unless we copy them. However, copying the whole
    // project directory is dangerous because we may expose sensitive files.
    // Instead, we establish a convention that only files in `public` directory
    // get served. Our build script will copy `public` into the `build` folder.
    // In `index.html`, you can get URL of `public` folder with %PUBLIC_URL%:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
    // Note that we only recommend to use `public` folder as an escape hatch
    // for files like `favicon.ico`, `manifest.json`, and libraries that are
    // for some reason broken when imported through Webpack. If you just want to
    // use an image, put it in `src` and `import` it from JavaScript instead.
    static: {
      directory: paths.appPublic,
      watch: {
        ignored: ignoredFiles(paths.appSrc),
      },
    },
    // Enable hot reloading through webpack-dev-server's native WebSocket client.
    hot: true,
    devMiddleware: {
      index: "embed.html",
      publicPath,
    },
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [],
    },
    // Listed explicitly so cross-site asset loads (the localhost:3000 iframe
    // loading from STATIC_URI=http://127.0.0.1:8080) pass the dev server's
    // cross-origin check.
    allowedHosts: ["localhost", "127.0.0.1"],
    proxy: [
      {
        context: "/api/graphql/live",
        // Proxy websocket connections.
        target: `ws://localhost:${serverPort}`,
        ws: true,
      },
      {
        context: (pathname) => {
          const lc = pathname.toLocaleLowerCase();
          return [
            "/embed/auth",
            "/embed/bootstrap",
            "/admin",
            "/account",
            "/install",
            "/api",
            "/graphiql",
          ].some((p) => p === lc || lc.startsWith(`${p}/`));
        },
        target: `http://localhost:${serverPort}`,
        onError: (err: Error, req: IncomingMessage, res: ServerResponse) => {
          res.writeHead(500, {
            "Content-Type": "text/html",
          });
          res.end(
            fs.readFileSync(
              path.join(__dirname, "webpackDevServerProxyError.html")
            )
          );
        },
      },
    ],
    setupMiddlewares(middlewares) {
      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432
      // Registered in the list (not with app.use) so the dev server's host
      // check and headers still run before it.
      const index = middlewares.findIndex(
        (m) => typeof m !== "function" && m.name === "webpack-dev-middleware"
      );
      middlewares.splice(index === -1 ? middlewares.length : index, 0, {
        name: "noop-service-worker",
        middleware: noopServiceWorkerMiddleware(publicPath),
      });
      return middlewares;
    },
  };
}
