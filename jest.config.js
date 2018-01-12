const path = require('path');
const { pluginsPath } = require('./plugins');

const buildTargets = ['coral-admin', 'coral-docs'];

const buildEmbeds = ['stream'];

// jest.config.js
module.exports = {
  testMatch: ['**/client/**/__tests__/**/*.js?(x)'],
  setupTestFrameworkScriptFile: '<rootDir>/test/client/setupJest.js',
  modulePaths: [
    '<rootDir>/plugins',
    '<rootDir>/client',
    ...buildTargets.map(target =>
      path.join('<rootDir>', 'client', target, 'src')
    ),
    ...buildEmbeds.map(embed =>
      path.join('<rootDir>', 'client', `coral-embed-${embed}`, 'src')
    ),
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'yaml', 'yml'],
  moduleDirectories: ['node_modules'],

  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '\\.ya?ml$': '<rootDir>/test/client/yamlTransformer.js',
  },

  moduleNameMapper: {
    '^plugin-api\\/(.*)$': '<rootDir>/plugin-api/$1',
    '^plugins\\/(.*)$': '<rootDir>/plugins/$1',
    '^pluginsConfig$': pluginsPath,

    '\\.(scss|css|less)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/test/client/fileMock.js',
  },
};
