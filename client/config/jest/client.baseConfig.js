const path = require("path");

const createConfig = () => {
  const d3Pkgs = [
    "d3|@3.1.0/d3",
    "d3-array|@3.1.0/d3-array",
    "d3-axis|@3.1.0/d3-axis",
    "d3-brush|@3.1.0/d3-brush",
    "d3-chord|@3.1.0/d3-chord",
    "d3-color|@3.1.0/d3-color",
    "d3-contour|@3.1.0/d3-contour",
    "d3-delaunay|@3.1.0/d3-delaunay",
    "d3-dispatch|@3.1.0/d3-dispatch",
    "d3-drag|@3.1.0/d3-drag",
    "d3-dsv|@3.1.0/d3-dsv",
    "d3-ease|@3.1.0/d3-ease",
    "d3-fetch|@3.1.0/d3-fetch",
    "d3-force|@3.1.0/d3-force",
    "d3-format|@3.1.0/d3-format",
    "d3-geo|@3.1.0/d3-geo",
    "d3-hierarchy|@3.1.0/d3-hierarchy",
    "d3-interpolate|@3.1.0/d3-interpolate",
    "d3-path|@3.1.0/d3-path",
    "d3-polygon|@3.1.0/d3-polygon",
    "d3-quadtree|@3.1.0/d3-quadtree",
    "d3-random|@3.1.0/d3-random",
    "d3-scale|@3.1.0/d3-scale",
    "d3-scale-chromatic|@3.1.0/d3-scale-chromatic",
    "d3-selection|@3.1.0/d3-selection",
    "d3-shape|@3.1.0/d3-shape",
    "d3-time|@3.1.0/d3-time",
    "d3-time-format|@3.1.0/d3-time-format",
    "d3-timer|@3.1.0/d3-timer",
    "d3-transition|@3.1.0/d3-transition",
    "d3-zoom|@3.1.0/d3-zoom",
  ];
  const transformIgnorePkgs = [
    "react-relay-network-modern|@5.0.0_relay-runtime@10.0.1/react-relay-network-modern",
    "@coralproject/rte|@2.2.4_react-dom@18.2.0_react@18.2.0/@coralproject/rte",
    "internmap|@2.0.3/internmap/src",
  ];

  return {
    displayName: "jestBaseConfig",
    rootDir: "../../",
    roots: ["<rootDir>/src/core/"],
    collectCoverageFrom: ["**/*.{js,jsx,mjs,ts,tsx}"],
    coveragePathIgnorePatterns: ["/node_modules/"],
    setupFiles: [
      "jest-canvas-mock",
      "<rootDir>/src/core/client/test/polyfills.ts",
      "<rootDir>/src/core/client/test/setup.ts",
    ],
    setupFilesAfterEnv: [
      "<rootDir>/src/core/client/test/setupTestFramework.ts",
    ],
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
      `node_modules/(?!.pnpm|${transformIgnorePkgs.join("|")}|${d3Pkgs.join(
        "|"
      )})`,
    ],
    moduleNameMapper: {
      "^coral-account/(.*)$": "<rootDir>/src/core/client/account/$1",
      "^coral-admin/(.*)$": "<rootDir>/src/core/client/admin/$1",
      "^coral-auth/(.*)$": "<rootDir>/src/core/client/auth/$1",
      "^coral-count/(.*)$": "<rootDir>/src/core/client/count/$1",
      "^coral-ui/(.*)$": "<rootDir>/src/core/client/ui/$1",
      "^coral-stream/(.*)$": "<rootDir>/src/core/client/stream/$1",
      "^coral-framework/(.*)$": "<rootDir>/src/core/client/framework/$1",
      "^coral-test/(.*)$": "<rootDir>/src/core/client/test/$1",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "ftl"],
    globals: {
      "ts-jest": {
        babelConfig: true,
        tsConfig: path.resolve(
          __dirname,
          "../../src/core/client/tsconfig.json"
        ),
      },
    },
    preset: "ts-jest/presets/js-with-babel",
  };
};

module.exports = createConfig;
