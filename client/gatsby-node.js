const fs = require("fs");
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

/** Path to postCSSConfig */
const postCSSConfigPath = path.resolve(
  __dirname,
  "../src/core/build/postcss.config"
);
const rootDir = path.resolve(__dirname, "../");
const srcDir = path.resolve(rootDir, "./src");
const appTsconfig = path.resolve(rootDir, "./src/core/client/tsconfig.json");

const CSS_PATTERN = /\.css$/;
const MODULE_CSS_PATTERN = /\.module\.css$/;

// Define `RegExp.toJSON` so that we can stringify RegExp.
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
  // Get webpack config.
  const config = getConfig();

  if (stage === "develop") {
    config.entry.commons.push(
      // Add our stream css variables file.
      `${srcDir}/core/client/ui/theme/stream.css.ts`
    );
  }

  /*
  TODO: (cvle) couldn't get build to work...
  if (stage === "build-javascript") {
    config.entry.app = [
      config.entry.app,
      `${appDir}/core/client/ui/theme/stream.css.ts`,
    ];
  }
  */

  // Find the gatsby CSS rules.
  const cssRules = findCssRules(config);
  // Exclude them from our src dir because they are incomaptible with our
  // CSS rules.
  cssRules.exclude = srcDir;
  // Add .tx .tsx to modules
  config.resolve.extensions.push(".ts", ".tsx");
  actions.replaceWebpackConfig(config);

  // Write out webpack config to .docz folder.
  fs.writeFileSync(
    path.resolve(__dirname, "webpack-" + stage),
    JSON.stringify(config, {}, 2)
  );

  // Turn on sourceMap during develop.
  const sourceMap = stage.startsWith("develop");

  // CSS loaders to prepend.
  const prependCSSLoaders = [];
  if (stage === "develop") {
    prependCSSLoaders.push(loaders.style());
  }

  /*
  TODO: (cvle) couldn't get build to work...
  if (stage === "build-javascript") {
    moreLoaders.push(loaders.style());
  }
  */

  actions.setWebpackConfig({
    resolve: {
      plugins: [
        // Resolve our custom paths.
        new TsconfigPathsPlugin({
          extensions: [".ts", ".tsx", ".js"],
          configFile: path.resolve(rootDir, "./src/core/client/tsconfig.json"),
        }),
      ],
    },
    module: {
      rules: [
        {
          include: srcDir,
          oneOf: [
            {
              test: /\.css\.ts$/,
              use: [
                ...prependCSSLoaders,
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    modules: {
                      localIdentName: "[name]-[local]-[hash:base64:5]",
                    },
                    importLoaders: 2,
                    sourceMap,
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
              use: [
                ...prependCSSLoaders,
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    modules: {
                      localIdentName: "[name]-[local]-[hash:base64:5]",
                    },
                    importLoaders: 1,
                    sourceMap,
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

  // Write out processed webpack config to .docz folder.
  fs.writeFileSync(
    path.resolve(__dirname, "webpack-" + stage + "-processed"),
    JSON.stringify(getConfig(), {}, 2)
  );
};
