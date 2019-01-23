const printBrowserLog = require('../helpers/printBrowserLog');

module.exports = {
  '@tags': ['admin', 'login'],

  before: client => {
    client.setWindowPosition(0, 0);
    client.resizeWindow(1024, 800);
  },

  afterEach: async (client, done) => {
    await printBrowserLog(client);
    if (client.currentTest.results.failed) {
      throw new Error('Test Case failed, skipping all the rest');
    }
    done();
  },

  after: client => {
    client.end();
  },

  'Admin goes to login': client => {
    const adminPage = client.page.admin();
    adminPage.navigate().expect.element('drawerButton').to.not.be.present;
  },

  'Admin logs in': client => {
    const adminPage = client.page.admin();
    const {
      testData: { admin },
    } = client.globals;

    adminPage.login(admin);
  },

  'Admin goes to Stories': client => {
    const adminPage = client.page.admin();

    adminPage.openDrawer().goToStories();
  },

  'Admin goes to Community': client => {
    const adminPage = client.page.admin();

    adminPage.openDrawer().goToCommunity();
  },
};
