/**
 * This is a project wide babel configuration.
 * https://babeljs.io/docs/en/config-files#project-wide-configuration
 */

// Note: If Webpack env is set, we are building for the client.

const plugins =
  process.env.WEBPACK === "true"
    ? [
        "use-lodash-es",
        "lodash",
        [
          "@babel/plugin-transform-runtime",
          {
            absoluteRuntime: true,
            corejs: 3,
            helpers: true,
            regenerator: true,
            useESModules: true,
            version: "^7.10.3",
          },
        ],
      ]
    : [];

const environment =
  process.env.WEBPACK === "true"
    ? { modules: false }
    : { targets: { node: "current" }, modules: "commonjs" };

module.exports = {
  babelrcRoots: ["./src/core/client/*"],
  plugins,
  presets: [["@babel/env", environment]],
  sourceType: "unambiguous",
};
