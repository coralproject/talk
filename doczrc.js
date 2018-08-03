// Apply all the configuration provided in the .env file.
require("dotenv").config();

const path = require("path");
const fs = require("fs");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const extensions = [".ts", ".tsx", ".js"];
const paths = require("./config/paths");

console.log(paths);

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
            localIdentName:
              process.env.NODE_ENV === "production"
                ? "[hash:base64]"
                : "[name]-[local]-[hash:base64:5]",
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
