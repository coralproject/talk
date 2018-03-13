const { ROOT_URL } = require('./config');

const REPORTS_FOLDER = process.env.REPORTS_FOLDER || './test/e2e/reports';

const nightwatch_config = {
  src_folders: './test/e2e/specs/',
  output_folder: REPORTS_FOLDER,
  page_objects_path: './test/e2e/page_objects',
  globals_path: './test/e2e/globals',

  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80,
  },

  test_settings: {
    default: {
      launch_url: ROOT_URL,
      desiredCapabilities: {
        browser: 'chrome',
        'browserstack.user': process.env.BROWSERSTACK_USER || 'coralproject2',
        'browserstack.key': process.env.BROWSERSTACK_KEY,
        'browserstack.local': true,
        'browserstack.localIdentifier': process.env
          .BROWSERSTACK_LOCAL_IDENTIFIER
          ? process.env.BROWSERSTACK_LOCAL_IDENTIFIER
          : undefined,
        'browserstack.debug': true,

        // Disable this, as it makes bs slow and brittle.
        'browserstack.networkLogs': false,
        resolution: '1600x1200',
      },
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: REPORTS_FOLDER,
      },
    },
    chrome: {
      desiredCapabilities: {
        browser: 'chrome',
        browser_version: '62',
        os: 'Windows',
        os_version: '10',
      },
    },
    firefox: {
      desiredCapabilities: {
        browser: 'firefox',
        browser_version: '56',
        os: 'Windows',
        os_version: '10',
      },
    },
    safari: {
      desiredCapabilities: {
        browser: 'safari',
        browser_version: '11',
      },
    },

    // The x64 bit IEDriver that is used by IE 11 has a known issue with sendKeys where
    // it may enter incorrect keys (shift + key).
    ie: {
      desiredCapabilities: {
        browser: 'internet explorer',
        os: 'Windows',
        os_version: '10',
        browser_version: '11',
      },
    },
    edge: {
      desiredCapabilities: {
        browser: 'edge',
        browser_version: '15',
        os: 'Windows',
        os_version: '10',
      },
    },
  },
};

// Code to copy seleniumhost/port into test settings
for (const i in nightwatch_config.test_settings) {
  const config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
}

module.exports = nightwatch_config;
