const nightwatch_config = {
  src_folders: './test/e2e/specs/',
  output_folder: './test/e2e/tests_output',

  selenium : {
    'start_process': false,
    'host': 'hub-cloud.browserstack.com',
    'port': 80
  },

  test_settings: {
    default: {
      launch_url: process.env.E2E_LAUNCH_URL || 'http://localhost:3000',
      desiredCapabilities: {
        'browserstack.user': process.env.BROWSERSTACK_USER || 'coralproject2',
        'browserstack.key': process.env.BROWSERSTACK_KEY,
        'browserstack.local': true,
        'browser': 'chrome',
        'browserstack.debug': true,
        'browserstack.networkLogs': true,
      }
    }
  }
};

// Code to copy seleniumhost/port into test settings
for(const i in nightwatch_config.test_settings){
  const config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
}

module.exports = nightwatch_config;
