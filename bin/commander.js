const pkg = require('../package.json');
const dotenv = require('dotenv');
const fs = require('fs');
const program = require('commander');
const util = require('../util');

// Perform rewrites to the runtime environment variables based on the contents
// of the process.env.REWRITE_ENV if it exists. This is done here as it is the
// entrypoint for the entire application.
require('env-rewrite').rewrite();

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

if (parseArgs.config) {
  let envConfig = dotenv.parse(fs.readFileSync(parseArgs.config, {encoding: 'utf8'}));

  Object.keys(envConfig).forEach((k) => {
    process.env[k] = envConfig[k];
  });
}

// If the `--pid` flag is used, put the current pid there.
if (parseArgs.pid) {
  util.pid(parseArgs.pid);
}

module.exports = program
  .version(pkg.version)
  .option('-c, --config [path]', 'Specify the configuration file to load')
  .option('--pid [path]', 'Specify a path to output the current PID to');
