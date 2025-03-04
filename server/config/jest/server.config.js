const path = require("path");

module.exports = {
  displayName: "server",
  rootDir: "../../",
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["**/*.{js,jsx,mjs,ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/src/core/server/test/setupTestFramework.ts"],
  testMatch: ["**/*.spec.{js,jsx,mjs,ts,tsx}"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/client/",
    "/src/core/server/data/cache/",
    "/src/core/server/services/users/integrationTests/",
  ],
  testEnvironment: "node",
  testEnvironmentOptions: {
    url: "http://localhost",
  },
  transform: {
    "^.+\\.tsx?$": [
      "<rootDir>/node_modules/ts-jest",
      {
        babel: true,
        tsconfig: path.resolve(__dirname, "../../src/tsconfig.json"),
      },
    ],
  },
  moduleNameMapper: {
    "^coral-server/(.*)$": "<rootDir>/src/core/server/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  preset: "ts-jest",
  workerIdleMemoryLimit: "1024MB",
};
