const path = require("path");

module.exports = {
  displayName: "server",
  rootDir: "../../",
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["**/*.{js,jsx,mjs,ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/src/core/server/test/setupTestFramework.ts"],
  testMatch: ["**/*.spec.{js,jsx,mjs,ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/", "/client/"],
  testEnvironment: "node",
  testURL: "http://localhost",
  transform: {
    "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest",
  },
  moduleNameMapper: {
    "^coral-server/(.*)$": "<rootDir>/src/core/server/$1",
    "^coral-common/(.*)$": "<rootDir>/src/core/common/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    "ts-jest": {
      babelConfig: true,
      tsConfig: path.resolve(__dirname, "../../src/tsconfig.json"),
    },
  },
  preset: "ts-jest",
};
