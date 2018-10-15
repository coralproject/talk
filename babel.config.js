/**
 * This is a project wide babel configuration.
 * https://babeljs.io/docs/en/config-files#project-wide-configuration
 *
 * We use this file to apply babel configuration to packages in `node_modules`
 * for testing with jest.
 */
module.exports = {
  env: {
    test: {
      presets: [
        [
          "@babel/env",
          { targets: "last 2 versions, ie 11", modules: "commonjs" },
        ],
        "@babel/react",
      ],
    },
  },
};
