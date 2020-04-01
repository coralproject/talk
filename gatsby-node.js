const fs = require("fs");
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const postCSSConfigPath = path.resolve(
  __dirname,
  "../src/core/build/postcss.config"
);
const rootDir = path.resolve(__dirname, "../");
const appDir = path.resolve(rootDir, "./src");
const appTsconfig = path.resolve(rootDir, "./src/core/client/tsconfig.json");

const CSS_PATTERN = /\.css$/;
const MODULE_CSS_PATTERN = /\.module\.css$/;

Object.defineProperty(RegExp.prototype, "toJSON", {
  value: RegExp.prototype.toString,
});

const isCssRules = (rule) =>
  rule.test &&
  (rule.test.toString() === CSS_PATTERN.toString() ||
    rule.test.toString() === MODULE_CSS_PATTERN.toString());

const findCssRules = (config) =>
  config.module.rules.find(
    (rule) => Array.isArray(rule.oneOf) && rule.oneOf.every(isCssRules)
  );

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
  getConfig,
}) => {
  const config = getConfig();
  if (stage === "develop") {
    config.entry.commons.push(
      `${appDir}/core/client/ui/theme/variables.css.ts`
    );
  }
  const cssRules = findCssRules(config);
  cssRules.exclude = appDir;
  config.resolve.extensions.push(".ts", ".tsx");
  actions.replaceWebpackConfig(config);
  fs.writeFileSync(
    path.resolve(__dirname, "tmp" + stage),
    JSON.stringify(config, {}, 2)
  );
  fs.writeFileSync(
    path.resolve(__dirname, "tmploaders"),
    JSON.stringify(Object.keys(loaders), {}, 2)
  );

  const moreLoaders =
    stage === "develop"
      ? [
          {
            loader: require.resolve("style-loader"),
          },
        ]
      : [];

  actions.setWebpackConfig({
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({
          extensions: [".ts", ".tsx", ".js"],
          configFile: path.resolve(rootDir, "./src/core/client/tsconfig.json"),
        }),
      ],
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.css\.ts$/,
              use: [
                ...moreLoaders,
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    modules: {
                      localIdentName: "[name]-[local]-[hash:base64:5]",
                    },
                    importLoaders: 2,
                    sourceMap: true,
                  },
                },
                {
                  loader: require.resolve("postcss-loader"),
                  options: {
                    config: {
                      path: postCSSConfigPath,
                    },
                    parser: "postcss-js",
                  },
                },
                {
                  loader: require.resolve("babel-loader"),
                  options: {
                    configFile: false,
                    babelrc: false,
                    presets: [
                      "@babel/typescript",
                      [
                        "@babel/env",
                        { targets: { node: "current" }, modules: "commonjs" },
                      ],
                    ],
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                  },
                },
              ],
            },
            {
              test: /\.css$/,
              include: appDir,
              use: [
                ...moreLoaders,
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    modules: {
                      localIdentName: "[name]-[local]-[hash:base64:5]",
                    },
                    importLoaders: 1,
                    sourceMap: true,
                  },
                },
                {
                  loader: require.resolve("postcss-loader"),
                  options: {
                    config: {
                      path: postCSSConfigPath,
                    },
                  },
                },
              ],
            },
            {
              test: /\.tsx?$/,
              use: [
                {
                  loader: require.resolve("babel-loader"),
                  options: {
                    root: rootDir,
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                  },
                },
                {
                  loader: require.resolve("ts-loader"),
                  options: {
                    configFile: appTsconfig,
                    compilerOptions: {
                      target: "es2015",
                      module: "esnext",
                      jsx: "preserve",
                      noEmit: false,
                      sourceMap: undefined,
                    },
                    transpileOnly: true,
                    // Overwrites the behavior of `include` and `exclude` to only
                    // include files that are actually being imported and which
                    // are necessary to compile the bundle.
                    onlyCompileBundledFiles: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  });
  fs.writeFileSync(
    path.resolve(__dirname, "new-" + stage),
    JSON.stringify(getConfig(), {}, 2)
  );
};
