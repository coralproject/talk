const lodashOptimizations = ["use-lodash-es", "lodash"];

module.exports = {
  presets: [
    ["@babel/env", { targets: "last 2 versions", modules: false }],
    "@babel/react",
  ],
  plugins: ["@babel/syntax-dynamic-import"],
  env: {
    production: {
      plugins: [...lodashOptimizations],
    },
    development: {
      plugins: [...lodashOptimizations],
    },
    test: {
      plugins: ["@babel/transform-modules-commonjs"],
    },
  },
};
