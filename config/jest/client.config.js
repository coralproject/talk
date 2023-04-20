const createConfig = require("./client.baseConfig");

const baseConfig = createConfig();

module.exports = {
  ...baseConfig,
  displayName: "client",
  roots: ["<rootDir>/src/core/client"],
}
