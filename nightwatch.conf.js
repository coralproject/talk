const { ROOT_URL } = require('./config');

module.exports = {
  src_folders: './test/e2e/specs/',
  output_folder: process.env.REPORTS_FOLDER || './test/e2e/reports',
  page_objects_path: './test/e2e/page_objects',
  globals_path: './test/e2e/globals',
  selenium: {
    start_process: true,
    server_path:
      'node_modules/selenium-standalone/.selenium/selenium-server/3.7.1-server.jar',
    log_path: './test/e2e/',
    host: '127.0.0.1',
    port: 6666,
    cli_args: {
      'webdriver.chrome.driver':
        'node_modules/selenium-standalone/.selenium/chromedriver/2.33-x64-chromedriver',
      'webdriver.gecko.driver':
        'node_modules/selenium-standalone/.selenium/geckodriver/0.19.1-x64-geckodriver',
    },
  },
  test_settings: {
    default: {
      launch_url: ROOT_URL,
      selenium_port: 6666,
      selenium_host: 'localhost',
      silent: true,
      desiredCapabilities: {
        browserName: 'chrome',
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
        path: process.env.REPORTS_FOLDER || './test/e2e/reports',
      },
    },
    chrome: {},
    'chrome-headless': {
      desiredCapabilities: {
        chromeOptions: {
          args: ['--headless', '--disable-gpu', 'window-size=1600,1200'],
        },
      },
    },
  },
};
