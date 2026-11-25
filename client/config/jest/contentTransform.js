"use strict";

const fs = require("fs");

// This is a custom Jest transformer that returns the content of a file

module.exports = {
  process(src, filename) {
    return {
      code: `module.exports = ${JSON.stringify(
        fs.readFileSync(filename).toString()
      )};`,
    };
  },
};
