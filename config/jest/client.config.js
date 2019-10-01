const path = require("path");

module.exports = {
  displayName: "client",
  rootDir: "../../",
  roots: ["<rootDir>/src/core/client"],
  collectCoverageFrom: ["**/*.{js,jsx,mjs,ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFiles: [
    "<rootDir>/src/core/build/polyfills.js",
    "<rootDir>/src/core/client/test/setup.ts",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/core/client/test/setupTestFramework.ts"],
  testMatch: ["**/*.spec.{js,jsx,mjs,ts,tsx}"],
  testEnvironment: "node",
  testURL: "http://localhost",
  transform: {
    "^.+\\.jsx?$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^.+\\.ftl$": "<rootDir>/config/jest/contentTransform.js",
    "^(?!.*\\.(js|jsx|mjs|ts|tsx|css|json|ftl)$)":
      "<rootDir>/config/jest/fileTransform.js",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\](?!(fluent|react-relay-network-modern)[/\\\\]).+\\.(js|jsx|mjs|ts|tsx)$",
  ],
  moduleNameMapper: {
    "^coral-account/(.*)$": "<rootDir>/src/core/client/account/$1",
    "^coral-admin/(.*)$": "<rootDir>/src/core/client/admin/$1",
    "^coral-auth/(.*)$": "<rootDir>/src/core/client/auth/$1",
    "^coral-count/(.*)$": "<rootDir>/src/core/client/count/$1",
    "^coral-ui/(.*)$": "<rootDir>/src/core/client/ui/$1",
    "^coral-stream/(.*)$": "<rootDir>/src/core/client/stream/$1",
    "^coral-framework/(.*)$": "<rootDir>/src/core/client/framework/$1",
    "^coral-common/(.*)$": "<rootDir>/src/core/common/$1",
    "^coral-test/(.*)$": "<rootDir>/src/core/client/test/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "ftl"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  globals: {
    "ts-jest": {
      useBabelrc: true,
      tsConfigFile: path.resolve(
        __dirname,
        "../../src/core/client/tsconfig.json"
      ),
    },
  },
};
