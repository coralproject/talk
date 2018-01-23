#!/usr/bin/env node

process.env['NODE_ENV'] = 'test';

const browserstack = require('browserstack-local');
const { onshutdown, shutdown } = require('../bin/util');
const program = require('commander');
const Table = require('cli-table');
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

async function start(program) {
  const localIdentifier = uuid();
  let browsers = program.browsers.split(',');
  const retries = Number.parseInt(program.retries);
  const browserstack = {};
  const date = new Date()
    .toISOString()
    .replace(/[T.]/g, '-')
    .replace(/:/g, '');
  const timeout = program.timeout;
  const reportsFolder = `${program.reportsFolder}/${date}`;
  let exitCode = 0;
  let config = 'nightwatch.conf.js';
  try {
    if (program.tunnel && program.bsKey) {
      await startTunnel(program.bsKey, localIdentifier);
    }

    console.log('Dropping test database');
    await mongoose.connection.dropDatabase();
    await serve();

    if (program.bsKey) {
      config = 'nightwatch-browserstack.conf.js';
      browserstack.localIdentifier = localIdentifier;
      browserstack.key = program.bsKey;
      browserstack.user = program.bsUser;
    } else {
      // Install selenium standalone.
      await seleniumInstall();
      if (program.headless) {
        browsers = browsers.map(b => `${b}-headless`);
      }
    }

    const succeeded = await runBrowserTests(
      browsers,
      config,
      retries,
      reportsFolder,
      browserstack,
      timeout
    );
    if (!succeeded) {
      exitCode = 1;
    }
  } catch (ex) {
    console.log('There was an error:\n\n');
    process.stderr.write(`${ex.stack}\n`);
    process.exit(2);
  } finally {
    console.log('Shutting down');
    shutdown();
  }
  process.exit(exitCode);
}

program
  .version('0.1.0')
  .description(
    'Perform e2e testing locally or if browserstack credentials are provided on browserstack.'
  )
  .option('-u, --bs-user [user]', 'Browserstack user', 'coralproject2')
  .option('-k, --bs-key [key]', 'Browserstack api key')
  .option('--no-tunnel', 'Dont start browserstack-local')
  .option('-b, --browsers [list of browsers]', 'Browsers to test', 'chrome')
  .option('-r, --retries [number]', 'Number of retries before failing', '1')
  .option('--headless', 'Start in headless mode for local e2e')
  .option('--reports-folder [folder]', 'Reports folder', './test/e2e/reports')
  .option('--timeout [number]', 'Timeout for WaitForConditions', '10000')
  .parse(process.argv);

start(program);
