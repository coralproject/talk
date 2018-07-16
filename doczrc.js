const path = require("path");
const fs = require("fs");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const extensions = [".ts", ".tsx", ".js"];
const paths = require("./config/paths");

// Ensure environment variables are read.
require("./config/env");

// const stringify = require('json-stringify-safe');

export default {
  title: "Talk 5.0",
  source: "./src",
  typescript: true,
  host: process.env.HOST || "0.0.0.0",
  port: parseInt(process.env.DOCZ_PORT, 10) || 3030,
  modifyBundlerConfig: config => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        require.resolve("style-loader"),
        {
          loader: require.resolve("css-loader"),
          options: {
            modules: true,
            importLoaders: 1,
          },
        },
        {
          loader: require.resolve("postcss-loader"),
          options: {
            config: {
              path: paths.appPostCssConfig,
            },
          },
        },
      ],
    });
    config.resolve.plugins = [
      new TsconfigPathsPlugin({ extensions, configFile: paths.appTsconfig }),
    ];
    // fs.writeFileSync(path.resolve(__dirname, "tmp"), stringify(config, null, 2));
    return config;
  },
};
