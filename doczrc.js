// Apply all the configuration provided in the .env file.
require("dotenv").config();

const path = require("path");
const fs = require("fs");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const extensions = [".ts", ".tsx", ".js"];
// TODO: There is some weird issue with including paths.ts here
const postCSSConfigPath = "./src/core/build/postcss.config";
const isProduction = process.NODE_ENV === "production";
const appDirectory = fs.realpathSync(process.cwd());

const styleLoader = {
  loader: require.resolve("style-loader"),
  options: {
    sourceMap: true,
    hmr: true,
  },
};

export default {
  title: "Coral 5.0",
  source: "./src",
  typescript: true,
  host: process.env.HOST || "0.0.0.0",
  port: parseInt(process.env.DOCZ_PORT, 10) || 3030,
  codeSandbox: false, // Too large to create code sandboxes..
  modifyBundlerConfig: config => {
    config.entry.app.push(
      `${appDirectory}/src/core/client/ui/theme/variables.css.ts`
    );
    config.module.rules.push({
      test: /\.css\.ts$/,
      use: [
        styleLoader,
        {
          loader: require.resolve("css-loader"),
          options: {
            modules: true,
            importLoaders: 2,
            localIdentName: "[name]-[local]-[hash:base64:5]",
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
                { targets: { node: "10.0.0" }, modules: "commonjs" },
              ],
            ],
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.css$/,
      use: [
        styleLoader,
        {
          loader: require.resolve("css-loader"),
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: "[name]-[local]-[hash:base64:5]",
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
    });
    config.resolve.plugins = [
      new TsconfigPathsPlugin({
        extensions,
        // TODO: There is some weird issue with including paths.ts here
        configFile: "./src/core/client/tsconfig.json",
      }),
    ];
    // fs.writeFileSync(path.resolve(__dirname, "tmp"), stringify(config, null, 2));
    return config;
  },
};
