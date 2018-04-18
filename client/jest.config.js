const { pluginsPath } = require('../plugins');

const buildTargets = ['coral-admin'];

const buildEmbeds = ['stream'];

const specPattern = 'client/**/__tests__/**/*.spec.js?(x)';

module.exports = {
  rootDir: '../',
  testMatch: [
    `<rootDir>/${specPattern}`,
    `<rootDir>/plugins/**/${specPattern}`,
  ],
  setupTestFrameworkScriptFile: '<rootDir>/test/client/setupJest.js',
  modulePaths: [
    '<rootDir>/plugins',
    '<rootDir>/client',
    ...buildTargets.map(target => `<rootDir>/client/${target}/src`),
    ...buildEmbeds.map(embed => `<rootDir>/client/coral-embed-${embed}/src`),
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'yaml', 'yml'],
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '\\.ya?ml$': '<rootDir>/test/client/yamlTransformer.js',
  },
  testResultsProcessor: process.env.JEST_REPORTER,
  moduleNameMapper: {
    '^plugin-api\\/(.*)$': '<rootDir>/plugin-api/$1',
    '^plugins\\/(.*)$': '<rootDir>/plugins/$1',
    '^pluginsConfig$': pluginsPath,
    '\\.(scss|css|less)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/test/client/fileMock.js',
  },
};
