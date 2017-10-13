module.exports = {
  'src_folders': './test/e2e/specs/',
  'output_folder': './test/e2e/tests_output',
  'page_objects_path': './test/e2e/page_objects',
  'selenium': {
    'start_process': true,
    'server_path': 'node_modules/selenium-standalone/.selenium/selenium-server/3.5.3-server.jar',
    'log_path': './test/e2e/reports',
    'host': '127.0.0.1',
    'port': 6666,
    'cli_args': {
      'webdriver.chrome.driver': 'node_modules/selenium-standalone/.selenium/chromedriver/2.32-x64-chromedriver'
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
      'globals': {
        'waitForConditionTimeout': 5000,
      },
      'screenshots' : {
        'enabled': true,
        'on_failure': true,
        'on_error': true,
        'path': './test/e2e/reports'
      },
    },
    'integration': {
      'launch_url': 'http://localhost:3000'
    }
  }
};
