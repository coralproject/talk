const paths = require("./paths");

module.exports = {
  rootDir: "../",
  roots: ["<rootDir>/src", "<rootDir>/scripts"],
  collectCoverageFrom: ["src/**/*.{js,jsx,mjs,ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFiles: ["<rootDir>/config/polyfills.js"],
  testMatch: [
    "**/__tests__/**/*.{js,jsx,mjs,ts,tsx}",
    "**/*.spec.{js,jsx,mjs,ts,tsx}",
  ],
  testEnvironment: "node",
  testURL: "http://localhost",
  transform: {
    "^.+\\.(js|jsx|mjs|ts|tsx)$": "<rootDir>/node_modules/ts-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|css|json|ftl)$)":
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
    "^talk-server/(.*)$": "<rootDir>/src/core/server/$1",
  },
  moduleFileExtensions: [
    "web.js",
    "js",
    "json",
    "web.jsx",
    "jsx",
    "node",
    "mjs",
    "ts",
    "tsx",
  ],
};
