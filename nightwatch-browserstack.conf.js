const {
  ROOT_URL
} = require('./config');

const nightwatch_config = {
  src_folders: './test/e2e/specs/',
  output_folder: process.env.REPORTS_FOLDER || './test/e2e/reports',
  page_objects_path: './test/e2e/page_objects',
  globals_path: './test/e2e/globals',

  selenium : {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80
  },

  test_settings: {
    default: {
      launch_url: ROOT_URL,
      desiredCapabilities: {
        browser: 'chrome',
        'browserstack.user': process.env.BROWSERSTACK_USER || 'coralproject2',
        'browserstack.key': process.env.BROWSERSTACK_KEY,
        'browserstack.local': true,
        'browserstack.debug': true,

        // Disable this, as it makes bs slow and brittle.
        'browserstack.networkLogs': false,
        'browserstack.resolution': '1600x1200',
      },
      screenshots : {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: process.env.REPORTS_FOLDER || './test/e2e/reports',
      },
    },
    chrome: {
      desiredCapabilities: {
        browser: 'chrome',
        browser_version: '62',
      },
    },
    firefox: {
      desiredCapabilities: {
        browser: 'firefox',
        browser_version: '56',
      },
    },
    safari: {
      desiredCapabilities: {

        // Safari since 8 seems to have troubles with the browserstack-local tunnel (10.18.17)
        browser: 'safari',
        browser_version: '10',
      },
    },
    ie: {
      desiredCapabilities: {
        browser: 'internet explorer',
        os: 'Windows',
        os_version: '10',
        browser_version: '11',

        // The x64 bit IEDriver that is used by IE 11 has a known issue with sendKeys where
        // it may enter incorrect keys (shift + key).
        // This adds a delay for each character as temporary fix as advised from the browserstack support.
        'browserstack.customSendKeys': 800,
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
  }
};

// Code to copy seleniumhost/port into test settings
for(const i in nightwatch_config.test_settings){
  const config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
}

module.exports = nightwatch_config;
