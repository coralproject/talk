module.exports = {
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/lib/**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};
