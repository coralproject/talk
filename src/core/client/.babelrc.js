module.exports = {
  presets: [
    ["@babel/env", { targets: "last 2 versions, ie 11", modules: false }],
    "@babel/react",
  ],
  plugins: ["@babel/syntax-dynamic-import"],
  env: {
    production: {
      plugins: [],
    },
    test: {
      plugins: ["transform-es2015-modules-commonjs"],
    },
  },
};
