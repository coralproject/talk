#!/usr/bin/env ts-node
import dotenv from "dotenv";

// Apply all the configuration provided in the .env file if it isn't already in
// the environment.
dotenv.config();

import chalk from "chalk";
import {
  choosePort,
  createCompiler,
  prepareUrls,
} from "react-dev-utils/WebpackDevServerUtils";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import createDevServerConfig from "../config/webpackDevServer.config";
import config from "../src/core/build/config";
import createWebpackConfig from "../src/core/build/createWebpackConfig";

// tslint:disable: no-console

// Enforce environment to be development.
config.validate().set("env", "development");

process.env.WEBPACK = "true";
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

const PORT = parseInt(process.env.DEV_SERVER_PORT!, 10) || 8080;
const HOST = "0.0.0.0";

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(
    `If this was unintentional, check that you haven't mistakenly set it in your shell.`
  );
  console.log(`Learn more here: ${chalk.yellow("http://bit.ly/2mwWSwH")}`);
  console.log();
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `choosePort()` Promise resolves to the next free port.
choosePort(HOST, PORT)
  .then((port: number) => {
    if (port == null) {
      // We have not found a port.
      return;
    }
    const protocol = "http";
    const appName = "Talk";
    const urls = prepareUrls(protocol, HOST, port);
    const webpackConfig = createWebpackConfig(config);
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler(webpack, webpackConfig, appName, urls);
    // Serve webpack assets generated by the compiler over a web sever.
    const serverConfig = createDevServerConfig({
      allowedHost: urls.lanUrlForConfig,
      serverPort: config.get("port"),
      publicPath: webpackConfig[0].output!.publicPath!,
    });
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, (err: Error) => {
      if (err) {
        return console.log(err);
      }
      console.log(chalk.cyan("Starting the development server...\n"));
    });

    ["SIGINT", "SIGTERM"].forEach((sig: any) => {
      process.once(sig, () => {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch((err: Error) => {
    if (err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
