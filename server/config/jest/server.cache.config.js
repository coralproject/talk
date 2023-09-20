const path = require("path");

module.exports = {
  displayName: "cache",
  rootDir: "../../",
  roots: ["<rootDir>/src/core/server/data/cache"],
  collectCoverageFrom: ["**/*.{js,jsx,mjs,ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/src/core/server/test/setupTestFramework.ts"],
  testMatch: ["**/*.spec.{js,jsx,mjs,ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/", "/client/"],
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
  runInBand: true,
};
