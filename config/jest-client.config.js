const path = require("path");

module.exports = {
  displayName: "client",
  rootDir: "../",
  roots: ["<rootDir>/src/core/client"],
  collectCoverageFrom: ["**/*.{js,jsx,mjs,ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFiles: [
    "<rootDir>/config/polyfills.js",
    "<rootDir>/src/core/client/test/setup.ts",
  ],
  testMatch: ["**/*.spec.{js,jsx,mjs,ts,tsx}"],
  testEnvironment: "node",
  testURL: "http://localhost",
  transform: {
    "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|ts|tsx|css|json|ftl)$)":
      "<rootDir>/config/jest/fileTransform.js",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$",
  ],
  moduleNameMapper: {
    "^talk-admin/(.*)$": "<rootDir>/src/core/client/admin/$1",
    "^talk-ui/(.*)$": "<rootDir>/src/core/client/ui/$1",
    "^talk-stream/(.*)$": "<rootDir>/src/core/client/stream/$1",
    "^talk-framework/(.*)$": "<rootDir>/src/core/client/framework/$1",
    "^talk-common/(.*)$": "<rootDir>/src/core/common/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  globals: {
    "ts-jest": {
      useBabelrc: true,
      tsConfigFile: path.resolve(__dirname, "tsconfig.jest.json"),
    },
  },
};
