const lodashOptimizations = ["use-lodash-es", "lodash"];

module.exports = {
  presets: ["@babel/react"],
  plugins: ["@babel/syntax-dynamic-import"],
  env: {
    production: {
      presets: [["@babel/env", { targets: "last 2 versions", modules: false }]],
      plugins: [...lodashOptimizations],
    },
    development: {
      presets: [["@babel/env", { targets: "last 2 versions", modules: false }]],
      plugins: [...lodashOptimizations],
    },
    test: {
      presets: [["@babel/env", { targets: { node: "current" } }]],
      plugins: ["@babel/transform-modules-commonjs"],
    },
  },
};
