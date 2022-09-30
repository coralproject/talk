const path = require("path");

const d3Pkgs = [
  "d3",
  "d3-array",
  "d3-axis",
  "d3-brush",
  "d3-chord",
  "d3-color",
  "d3-contour",
  "d3-delaunay",
  "d3-dispatch",
  "d3-drag",
  "d3-dsv",
  "d3-ease",
  "d3-fetch",
  "d3-force",
  "d3-format",
  "d3-geo",
  "d3-hierarchy",
  "d3-interpolate",
  "d3-path",
  "d3-polygon",
  "d3-quadtree",
  "d3-random",
  "d3-scale",
  "d3-scale-chromatic",
  "d3-selection",
  "d3-shape",
  "d3-time",
  "d3-time-format",
  "d3-timer",
  "d3-transition",
  "d3-zoom",
];

module.exports = {
  displayName: "client",
  rootDir: "../../",
  roots: ["<rootDir>/src/core/client"],
  collectCoverageFrom: ["**/*.{js,jsx,mjs,ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFiles: [
    "<rootDir>/src/core/client/test/polyfills.ts",
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
    `[/\\\\]node_modules[/\\\\](?!(fluent|react-relay-network-modern|@coralproject/rte/lib|internmap|${d3Pkgs.join(
      "|"
    )})[/\\\\]).+\\.(js|jsx|mjs|ts|tsx)$`,
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
  globals: {
    "ts-jest": {
      babelConfig: true,
      tsConfig: path.resolve(__dirname, "../../src/core/client/tsconfig.json"),
    },
  },
  preset: "ts-jest/presets/js-with-babel",
};
