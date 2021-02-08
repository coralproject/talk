// Apply all the configuration provided in the .env file if it isn't already in
// the environment.
require("dotenv").config();

const withYaml = require("next-plugin-yaml");

module.exports = withYaml({
  basePath: process.env.BASE_PATH
    ? process.env.BASE_PATH.replace(/^\//, "")
    : "/docs",
  webpack: (config, { dev, isServer }) => {
    // Replace React with Preact only in client production build
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      };
    }

    return config;
  },
});
