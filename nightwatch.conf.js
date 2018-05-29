const { ROOT_URL } = require('./config');

const REPORTS_FOLDER = process.env.REPORTS_FOLDER || './test/e2e/reports';

module.exports = {
  src_folders: './test/e2e/specs/',
  output_folder: REPORTS_FOLDER,
  page_objects_path: './test/e2e/page_objects',
  globals_path: './test/e2e/globals',
  selenium: {
    start_process: true,
    server_path:
      'node_modules/selenium-standalone/.selenium/selenium-server/3.8.1-server.jar',
    log_path: REPORTS_FOLDER,
    host: '127.0.0.1',
    port: 6666,
    cli_args: {
      'webdriver.chrome.driver':
        'node_modules/selenium-standalone/.selenium/chromedriver/2.37-x64-chromedriver',
      'webdriver.gecko.driver':
        'node_modules/selenium-standalone/.selenium/geckodriver/0.20.1-x64-geckodriver',
    },
  },
  test_settings: {
    default: {
      launch_url: ROOT_URL,
      selenium_port: 6666,
      selenium_host: 'localhost',
      silent: true,
      desiredCapabilities: {
        javascriptEnabled: true,
        acceptSslCerts: true,
        webStorageEnabled: true,
        databaseEnabled: true,
        applicationCacheEnabled: false,
        nativeEvents: true,
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
        browserName: 'chrome',
      },
    },
    'chrome-headless': {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--headless', '--disable-gpu', 'window-size=1600,1200'],
        },
      },
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
      },
    },
    'firefox-headless': {
      desiredCapabilities: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          args: ['-headless'],
        },
      },
    },
  },
};
