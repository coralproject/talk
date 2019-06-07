/**
 * This is a project wide babel configuration.
 * https://babeljs.io/docs/en/config-files#project-wide-configuration
 *
 * We use this file to apply babel configuration to packages in `node_modules`
 */

const lodashOptimizations =
  process.env.WEBPACK === "true" ? ["use-lodash-es", "lodash"] : [];

module.exports = {
  babelrcRoots: ["./src/core/client/*"],
  env: {
    production: {
      plugins: [...lodashOptimizations],
    },
    development: {
      plugins: [...lodashOptimizations],
    },
    test: {
      presets: [
        ["@babel/env", { targets: { node: "current" } }],
        "@babel/react",
      ],
      plugins: ["dynamic-import-node"],
    },
  },
};
