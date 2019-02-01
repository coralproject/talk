module.exports = {
  displayName: "server",
  rootDir: "../../",
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["**/*.{js,jsx,mjs,ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/*.spec.{js,jsx,mjs,ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/", "/client/"],
  testEnvironment: "node",
  testURL: "http://localhost",
  transform: {
    "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest",
  },
  moduleNameMapper: {
    "^talk-server/(.*)$": "<rootDir>/src/core/server/$1",
    "^talk-common/(.*)$": "<rootDir>/src/core/common/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    "ts-jest": {
      useBabelrc: true,
    },
  },
};
