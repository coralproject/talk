const createConfig = require("./client.baseConfig");

const baseConfig = createConfig();

module.exports = {
  ...baseConfig,
  displayName: "client:stream",
  roots: ["<rootDir>/src/core/client/stream"],
}
