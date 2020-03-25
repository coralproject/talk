#!/usr/bin/env ts-node

import dotenv from "dotenv";

// Apply all the configuration provided in the .env file if it isn't already in
// the environment.
dotenv.config();

import chalk from "chalk";
import fs from "fs-extra";
import FileSizeReporter from "react-dev-utils/FileSizeReporter";
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages";
import printBuildError from "react-dev-utils/printBuildError";
import webpack from "webpack";

import paths from "../config/paths";
import config from "../src/core/build/config";
import createWebpackConfig from "../src/core/build/createWebpackConfig";

/* eslint-disable no-console */

process.env.WEBPACK = "true";
process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.BABEL_ENV = process.env.NODE_ENV;

// Enforce environment to be NODE_ENV.
config.validate().set("env", process.env.NODE_ENV);

const isProduction = process.env.NODE_ENV === "production";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

// Treat warnings as errors when we are in CI
// TODO: This is currently turned off until we have
// an optimized build.
const treatWarningsAsErrors =
  false &&
  process.env.CI &&
  (typeof process.env.CI !== "string" ||
    process.env.CI!.toLowerCase() !== "false");

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appDistStatic)
  .then((previousFileSizes: any) => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appDistStatic);
    // Merge with the public folder
    if (fs.pathExistsSync(paths.appPublic)) {
      copyPublicFolder();
    }
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }: any) => {
      if (warnings.length) {
        console.log(chalk.yellow("Compiled with warnings.\n"));
        console.log(warnings.join("\n\n"));
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
      } else {
        console.log(chalk.green("Compiled successfully.\n"));
      }

      console.log("File sizes after gzip:\n");
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appDistStatic,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();
    },
    (err: Error) => {
      console.log(chalk.red("Failed to compile.\n"));
      printBuildError(err);
      process.exit(1);
    }
  );

// Create the production build and print the deployment instructions.
function build(previousFileSizes: any) {
  if (isProduction) {
    console.log("Creating an optimized production build...");
  } else {
    console.log("Creating development build...");
  }
  const webpackConfig = createWebpackConfig(config);
  const compiler = webpack(webpackConfig);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(
        stats.toJson({
          children: webpackConfig.map((c) => c.stats || {}) as any,
        })
      );
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join("\n\n")));
      }
      if (treatWarningsAsErrors && messages.warnings.length) {
        console.log(
          chalk.yellow(
            "\nTreating warnings as errors because process.env.CI = true.\n" +
              "Most CI servers set it automatically.\n"
          )
        );
        return reject(new Error(messages.warnings.join("\n\n")));
      }
      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appDistStatic, {
    dereference: true,
  });
}
