#!/usr/bin/env node

"use strict";
// Set timezone to UTC for stable tests.
process.env.TZ = "UTC";

// Allow importing typescript files.
require("ts-node/register");

// Apply all the configuration provided in the .env file.
require("dotenv").config();

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

const paths = require("../config/paths.client.stream.ts").default;

const jest = require("jest");

const argv = [];
argv.push("--env=jsdom");
argv.push("--config", paths.appJestConfig);

jest.run(argv);
