module.exports = {
  presets: [
    ["@babel/env", { targets: "last 2 versions, ie 11", modules: false }],
    "@babel/react",
  ],
  plugins: ["@babel/syntax-dynamic-import", "use-lodash-es", "lodash"],
  env: {
    production: {
      plugins: [],
    },
    test: {
      plugins: ["@babel/transform-modules-commonjs"],
    },
  },
};
