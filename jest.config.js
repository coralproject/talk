module.exports = {
  projects: ['<rootDir>', '<rootDir>/client'],
  testPathIgnorePatterns: ['client'],
  setupTestFrameworkScriptFile: '<rootDir>/test/setupJest.js',
  testResultsProcessor: process.env.JEST_REPORTER,
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
};
