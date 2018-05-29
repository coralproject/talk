#!/usr/bin/env node

process.env['NODE_ENV'] = 'test';

const browserstack = require('browserstack-local');
const { onshutdown, shutdown } = require('../bin/util');
const program = require('commander');
const Table = require('cli-table2');
const serve = require('../serve');
const childProcess = require('child_process');
const uuid = require('uuid').v4;
const mongoose = require('../services/mongoose');

// Make things colorful!
require('colors');

function startTunnel(key, localIdentifier) {
  const bs_local = new browserstack.Local();

  // Code to start browserstack local before start of test
  console.log('Connecting local');

  return new Promise((resolve, reject) => {
    bs_local.start(
      {
        key,
        logFile: './test/e2e/bslocal.log',
        verbose: 'true',
        force: 'true',
        onlyAutomate: 'true',
        localIdentifier,
      },
      error => {
        if (error) {
          reject(error);
        }
        resolve();
      }
    );
    onshutdown([() => bs_local.stop(function() {})]);
  });
}

function seleniumInstall() {
  return new Promise((resolve, reject) => {
    try {
      const nw = childProcess.spawn(
        './node_modules/.bin/selenium-standalone',
        ['install'],
        {
          stdio: 'inherit',
        }
      );
      nw.on('close', code => {
        code === 0 ? resolve() : reject();
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

function nightwatch(env, config, reportsFolder, browserstack, timeout) {
  return new Promise((resolve, reject) => {
    try {
      const nw = childProcess.spawn(
        './node_modules/.bin/nightwatch',
        ['--config', config, '--env', env],
        {
          env: Object.assign({}, process.env, {
            BROWSERSTACK_LOCAL_IDENTIFIER: browserstack.localIdentifier,
            BROWSERSTACK_KEY: browserstack.key,
            BROWSERSTACK_USER: browserstack.user,
            REPORTS_FOLDER: `${reportsFolder}/${env}`,
            WAIT_FOR_TIMEOUT: timeout,
          }),
          stdio: 'inherit',
        }
      );
      nw.on('close', code => {
        code === 0 ? resolve() : reject();
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

function printResults(browsers, succeeded, retries) {
  let table = new Table({
    head: ['Browser'.cyan, 'Status'.cyan, 'Retries'.cyan],
  });

  for (let browser of browsers) {
    const wasSuccessful = browser in succeeded;
    table.push([
      browser,
      wasSuccessful ? 'success'.green : 'failed'.red,
      wasSuccessful ? succeeded[browser] : retries,
    ]);
  }

  console.log(table.toString());
}

function printSection(txt) {
  console.log('*****************************'.magenta);
  console.log(`${'*'.magenta} ${txt.cyan}`);
  console.log('*****************************'.magenta);
}

async function runBrowserTests(
  browsers,
  config,
  retries = 1,
  reportsFolder,
  browserstack,
  timeout
) {
  const succeeded = {};
  for (let browser of browsers) {
    for (let t = 0; t < retries + 1; t++) {
      try {
        printSection(`e2e test for ${browser} #${t}`);
        await nightwatch(browser, config, reportsFolder, browserstack, timeout);
        succeeded[browser] = t;
        console.log(`\n==> Succeeded e2e for ${browser} #${t}\n`.green);
        break;
      } catch (ex) {
        if (ex) {
          console.log('There was an error while starting the test runner:\n\n');
          process.stderr.write(`${ex.stack}\n`);
        }
        console.log(`\n==> Failed e2e for ${browser} #${t}\n`.red);
      }
    }
  }
  printResults(browsers, succeeded, retries);
  return Object.keys(succeeded).length === browsers.length;
}

class E2E {
  constructor(opts) {
    this.browserstackEnabled = Boolean(opts.bsKey && opts.browserstack);
    if (this.browserstackEnabled && opts.headless) {
      console.error('--browserstack and --headless cannot be combined');
      process.exit(1);
    }

    this.localIdentifier = uuid();
    this.retries = Number.parseInt(opts.retries);
    this.browserstack = {};
    this.date = new Date()
      .toISOString()
      .replace(/[T.]/g, '-')
      .replace(/:/g, '');
    this.browsers = opts.browsers.split(',').map(browser => {
      if (opts.headless) {
        return `${browser}-headless`;
      }

      return browser;
    });
    this.timeout = opts.timeout;
    this.reportsFolder = `${opts.reportsFolder}/${this.date}`;
    this.config = this.browserstackEnabled
      ? 'nightwatch-browserstack.conf.js'
      : 'nightwatch.conf.js';
    this.tunnel = opts.tunnel;
    this.bsKey = opts.bsKey;
    this.bsUser = opts.bsUser;
  }

  async start() {
    let exitCode = 0;
    try {
      if (this.tunnel && this.bsKey) {
        await startTunnel(this.bsKey, this.localIdentifier);
      }

      console.log('Dropping test database');
      await mongoose.connection.dropDatabase();
      console.log('Starting the server');
      await serve({ websockets: true });

      if (this.browserstackEnabled) {
        browserstack.localIdentifier = this.localIdentifier;
        browserstack.key = this.bsKey;
        browserstack.user = this.bsUser;
      } else {
        // Install selenium standalone.
        await seleniumInstall();
      }

      // Run the tests.
      const succeeded = await runBrowserTests(
        this.browsers,
        this.config,
        this.retries,
        this.reportsFolder,
        browserstack,
        this.timeout
      );
      if (!succeeded) {
        exitCode = 1;
      }
    } catch (err) {
      console.log('There was an error:\n\n');
      process.stderr.write(`${err.stack}\n`);
      process.exit(2);
    } finally {
      console.log('Shutting down');
      shutdown();
      process.exit(exitCode);
    }
  }
}

program
  .version('0.1.0')
  .description(
    'Perform e2e testing locally or if browserstack credentials are provided on browserstack.'
  )
  .option('-u, --bs-user [user]', 'Browserstack user', 'coralproject2')
  .option(
    '-k, --bs-key [key]',
    'Browserstack api key',
    process.env.BROWSERSTACK_KEY
  )
  .option('--browserstack', 'Enables Browserstack testing')
  .option('--no-tunnel', 'Dont start browserstack-local')
  .option('-b, --browsers [list of browsers]', 'Browsers to test', 'chrome')
  .option('-r, --retries [number]', 'Number of retries before failing', '1')
  .option('--headless', 'Start in headless mode for local e2e')
  .option('--reports-folder [folder]', 'Reports folder', './test/e2e/reports')
  .option('--timeout [number]', 'Timeout for WaitForConditions', '10000')
  .parse(process.argv);

const e2e = new E2E(program);
e2e.start();
