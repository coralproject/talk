export default {
  '@tags': ['app'],
  'Base url and Hostname': browser => {
    const {baseUrl} = browser.globals;
    browser
      .url(baseUrl)
      .assert.title('Coral Talk')
      .waitForElementPresent('body', 1000);
  },
  after: client => {
    client.end();
  }
};
