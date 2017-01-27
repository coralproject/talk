require('babel-core/register');

let E2E_REPORT_PATH = './test/e2e/reports';
if (process.env.E2E_REPORT_PATH && process.env.E2E_REPORT_PATH.length > 0) {
  E2E_REPORT_PATH = process.env.E2E_REPORT_PATH;
}

module.exports = {
  'src_folders': './test/e2e/tests',
  'output_folder': E2E_REPORT_PATH,
  'page_objects_path': './test/e2e/pages',
  'globals_path': './test/e2e/globals',
  'custom_commands_path' : '',
  'custom_assertions_path' : '',
  'selenium': {
    'start_process': true,
    'server_path': 'node_modules/selenium-standalone/.selenium/selenium-server/2.53.1-server.jar',
    'log_path': E2E_REPORT_PATH,
    'host': '127.0.0.1',
    'port': 6666,
    'cli_args': {
      'webdriver.chrome.driver': 'node_modules/selenium-standalone/.selenium/chromedriver/2.25-x64-chromedriver'
    }
  },
  'test_settings': {
    'default': {
      'launch_url' : 'http://localhost:3000',
      'selenium_port': 6666,
      'selenium_host': 'localhost',
      'silent': true,
      'desiredCapabilities': {
        'browserName': 'chrome',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
        'webStorageEnabled': true,
        'databaseEnabled': true,
        'applicationCacheEnabled': false,
        'nativeEvents': true
      },
      'screenshots' : {
        'enabled': true,
        'on_failure': true,
        'on_error': true,
        'path': E2E_REPORT_PATH
      },
      'exclude': [
        './tests/e2e/tests/EmbedStreamTests.js'
      ]
    },
    'integration': {
      'launch_url': 'http://localhost:3000'
    }
  }
};
