const pkg = require('../package.json');
const dotenv = require('dotenv');
const fs = require('fs');
const program = require('commander');

//==============================================================================
// Setting up the program command line arguments.
//==============================================================================

const parseArgs = require('minimist')(process.argv.slice(2), {
  alias: {
    'c': 'config'
  },
  string: [
    'config',
    'pid'
  ],
  default: {
    'config': null,
    'pid': null
  }
});

/**
 * If the config flag is present, then we have to load the configuration from
 * the file specified. We will then load those values into the environment.
 */
if (parseArgs.config) {
  let envConfig = dotenv.parse(fs.readFileSync(parseArgs.config, {encoding: 'utf8'}));

  Object.keys(envConfig).forEach((k) => {
    process.env[k] = envConfig[k];
  });
}

/**
 * If the pid flag is present, then we have to create a pid file at the location
 * specified.
 */
if (parseArgs.pid) {
  const util = require('./util');

  console.log('Wrote PID');

  util.pid(parseArgs.pid);
}

module.exports = program
  .version(pkg.version)
  .option('-c, --config [path]', 'Specify the configuration file to load')
  .option('--pid [path]', 'Specify a path to output the current PID to');
