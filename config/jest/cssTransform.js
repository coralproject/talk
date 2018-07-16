"use strict";

// Adapted version of https://github.com/Connormiha/jest-css-modules-transform
// Copyright https://github.com/Connormiha/jest-css-modules-transform/graphs/contributors
// This oututs `module.exports = cssObject` instead of `module.exports = { default: cssObject }`;

const { sep: pathSep, resolve, basename, extname } = require("path");
const postcss = require("postcss");
const postcssNested = postcss([require("postcss-nested")]);

const REG_EXP_NAME_BREAK_CHAR = /[\s,.{/#[:]/;

const getCSSSelectors = (css, path) => {
  const end = css.length;
  let i = 0;
  let char;
  let bracketsCount = 0;
  const result = {};

  while (i < end) {
    if (i === -1) {
      throw Error(`Parse error ${path}`);
    }
    if (css.indexOf("/*", i) === i) {
      i = css.indexOf("*/", i + 2);
      // Unclosed comment. Break to avoid infinity loop
      if (i === -1) {
        // Don't parse, but save collected result
        return result;
      }
      continue;
    }
    char = css[i];
    if (char === "{") {
      bracketsCount++;
      i++;
      continue;
    }
    if (char === "}") {
      bracketsCount--;
      i++;
      continue;
    }
    if (char === '"' || char === "'") {
      do {
        i = css.indexOf(char, i + 1);
        // Syntax error since this line. Don't parse, but save collected result
        if (i === -1) {
          return result;
        }
      } while (css[i - 1] === "\\");
      i++;
      continue;
    }
    if (bracketsCount > 0) {
      i++;
      continue;
    }
    if (char === "." || char === "#") {
      i++;
      const startWord = i;
      while (!REG_EXP_NAME_BREAK_CHAR.test(css[i])) {
        i++;
      }
      const word = css.slice(startWord, i);
      result[word] = word;
      continue;
    }
    if (css.indexOf("@keyframes", i) === i) {
      i += 10;
      while (REG_EXP_NAME_BREAK_CHAR.test(css[i])) {
        i++;
      }
      const startWord = i;
      while (!REG_EXP_NAME_BREAK_CHAR.test(css[i])) {
        i++;
      }
      const word = css.slice(startWord, i);
      result[word] = word;
      continue;
    }
    i++;
  }
  return result;
};

module.exports = {
  process(src, path, config) {
    const filename = path.slice(path.lastIndexOf(pathSep) + 1);
    const textCSS = postcssNested.process(src).css;
    const selectors = getCSSSelectors(textCSS, path);
    const component = basename(path, extname(path));

    // Prefix class names with component name.
    Object.keys(selectors).forEach(k => {
      selectors[k] = selectors[k]
        .split(/\s+/)
        .map(v => `${component}-${v}`)
        .join(" ");
    });

    const exprt = JSON.stringify(selectors);
    return `module.exports = ${exprt}`;
  },
};
