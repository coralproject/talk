"use strict";

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// This is a custom Jest transformer that returns the content of a file

module.exports = {
  process(src, filename) {
    return `module.exports = ${JSON.stringify(
      fs.readFileSync(filename).toString()
    )};`;
  },
};
