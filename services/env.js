// Ensure that we always process the rewrites silently, otherwise it may fail in
// environments like Heroku.
process.env.REWRITE_ENV_SILENT = 'TRUE';

// Perform rewrites to the runtime environment variables based on the contents
// of the process.env.REWRITE_ENV if it exists. This is done here as it is the
// entrypoint for the entire applications configuration.
require('env-rewrite').rewrite();

if (process.env.NODE_ENV !== 'test') {
  // Apply all the configuration provided in the .env file if it isn't already
  // in the environment.
  require('dotenv').config();
}
