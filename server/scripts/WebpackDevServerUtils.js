/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is taken from create-react-app.
 * We disabled tty support, removed unessential parts to us and
 * added support for `warningsFilter` and Multi Webpack Config.
 *
 * TODO: (cvle) The `forkTsCheckerWebpackPlugin` hooks are not working atm.
 */
"use strict";

/* eslint-disable no-console */

const address = require("address");
const url = require("url");
const chalk = require("chalk");
const clearConsole = require("react-dev-utils/clearConsole");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");
const forkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");

// (cvle): Changed to false as we are sharing the tty with other processes.
// const isInteractive = process.stdout.isTTY && false;
const isInteractive = false;

function prepareUrls(protocol, host, port) {
  const formatUrl = (hostname) =>
    url.format({
      protocol,
      hostname,
      port,
      pathname: "/",
    });
  const prettyPrintUrl = (hostname) =>
    url.format({
      protocol,
      hostname,
      port: chalk.bold(port),
      pathname: "/",
    });

  const isUnspecifiedHost = host === "0.0.0.0" || host === "::";
  let prettyHost;
  let lanUrlForConfig;
  let lanUrlForTerminal;
  if (isUnspecifiedHost) {
    prettyHost = "localhost";
    try {
      // This can only return an IPv4 address
      lanUrlForConfig = address.ip();
      if (lanUrlForConfig) {
        // Check if the address is a private ip
        // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
        if (
          /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(
            lanUrlForConfig
          )
        ) {
          // Address is private, format it for later use
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
        } else {
          // Address is not private, so we will discard it
          lanUrlForConfig = undefined;
        }
      }
    } catch (_e) {
      // ignored
    }
  } else {
    prettyHost = host;
  }
  const localUrlForTerminal = prettyPrintUrl(prettyHost);
  const localUrlForBrowser = formatUrl(prettyHost);
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser,
  };
}

function printInstructions(appName, urls, useYarn) {
  console.log();
  console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
  console.log();

  if (urls.lanUrlForTerminal) {
    console.log(
      `  ${chalk.bold("Local:")}            ${urls.localUrlForTerminal}`
    );
    console.log(
      `  ${chalk.bold("On Your Network:")}  ${urls.lanUrlForTerminal}`
    );
  } else {
    console.log(`  ${urls.localUrlForTerminal}`);
  }

  console.log();
  console.log("Note that the development build is not optimized.");
  console.log(
    `To create a production build, use ` +
      `${chalk.cyan(`${useYarn ? "yarn" : "npm run"} build`)}.`
  );
  console.log();
}

function createCompiler({
  appName,
  config,
  devSocket,
  urls,
  useYarn,
  useTypeScript,
  webpack,
}) {
  // "Compiler" is a low-level interface to Webpack.
  // It lets us listen to some events and provide our own custom messages.
  let compiler;
  try {
    compiler = webpack(config);
  } catch (err) {
    console.log(chalk.red("Failed to compile."));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.hooks.invalid.tap("invalid", () => {
    if (isInteractive) {
      clearConsole();
    }
    console.log("Compiling...");
  });

  let isFirstCompile = true;
  const tsMessagesPromises = [];

  if (useTypeScript) {
    compiler.compilers.forEach((singleCompiler) => {
      let tsMessagesPromise;
      let tsMessagesResolver;
      singleCompiler.hooks.beforeCompile.tap("beforeCompile", () => {
        tsMessagesPromise = new Promise((resolve) => {
          tsMessagesResolver = (msgs) => resolve(msgs);
        });
        tsMessagesPromises.push(tsMessagesPromise);
      });

      const tsCheckerHooks =
        forkTsCheckerWebpackPlugin.getCompilerHooks(singleCompiler);

      // now access hooks just like before
      // TODO: (cvle) this doesn't work currently.
      tsCheckerHooks.waiting.tap("yourListenerName", () => {
        console.log("waiting for typecheck results");
      });

      // TODO: (cvle) this doesn't work currently.
      tsCheckerHooks.receive.tap(
        "afterTypeScriptCheck",
        (diagnostics, lints) => {
          console.log("RECEIVED");
          const allMsgs = [...diagnostics, ...lints];
          const format = (message) =>
            `${message.file}\n${typescriptFormatter(message, true)}`;

          tsMessagesResolver({
            errors: allMsgs
              .filter((msg) => msg.severity === "error")
              .map(format),
            warnings: allMsgs
              .filter((msg) => msg.severity === "warning")
              .map(format),
          });
        }
      );
    });
  }

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.hooks.done.tap("done", async (stats) => {
    if (isInteractive) {
      clearConsole();
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    // We only construct the warnings and errors for speed:
    // https://github.com/facebook/create-react-app/issues/4492#issuecomment-421959548
    const statOptions = {
      all: false,
      warnings: true,
      errors: true,
      ...config.stats,
    };
    if (Array.isArray(config)) {
      statOptions.children = config.map((c) => c.stats || {});
    }
    const statsData = stats.toJson(statOptions);

    if (useTypeScript && statsData.errors.length === 0) {
      const delayedMsg = setTimeout(() => {
        console.log(
          chalk.yellow(
            "Files successfully emitted, waiting for typecheck results..."
          )
        );
      }, 100);

      // Get back all tscheck results.
      const results = await Promise.all(tsMessagesPromises);
      clearTimeout(delayedMsg);

      results.forEach((msgs) => {
        statsData.errors.push(...msgs.errors);
        statsData.warnings.push(...msgs.warnings);

        // Push errors and warnings into compilation result
        // to show them after page refresh triggered by user.
        stats.compilation.errors.push(...msgs.errors);
        stats.compilation.warnings.push(...msgs.warnings);

        if (msgs.errors.length > 0) {
          devSocket.errors(msgs.errors);
        } else if (msgs.warnings.length > 0) {
          devSocket.warnings(msgs.warnings);
        }
      });

      if (isInteractive) {
        clearConsole();
      }
    }

    const messages = formatWebpackMessages(statsData);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    if (isSuccessful) {
      console.log(chalk.green("Compiled successfully!"));
    }
    if (isSuccessful && (isInteractive || isFirstCompile)) {
      printInstructions(appName, urls, useYarn);
    }
    isFirstCompile = false;

    // If errors exist, only show errors.
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      console.log(chalk.red("Failed to compile.\n"));
      console.log(messages.errors.join("\n\n"));
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow("Compiled with warnings.\n"));
      console.log(messages.warnings.join("\n\n"));

      // Teach some ESLint tricks.
      console.log(
        "\nSearch for the " +
          chalk.underline(chalk.yellow("keywords")) +
          " to learn more about each warning."
      );
      console.log(
        "To ignore, add " +
          chalk.cyan("// eslint-disable-next-line") +
          " to the line before.\n"
      );
    }
  });

  return compiler;
}

module.exports = {
  createCompiler,
  prepareUrls,
};
