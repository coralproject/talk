const createConfig = require("./client.baseConfig");

const baseConfig = createConfig();

module.exports = {
  ...baseConfig,
  displayName: "client:admin",
  roots: ["<rootDir>/src/core/client/admin"],
}
