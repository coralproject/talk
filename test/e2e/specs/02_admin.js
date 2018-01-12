module.exports = {
  '@tags': ['admin', 'login'],

  before: client => {
    client.setWindowPosition(0, 0);
    client.resizeWindow(1024, 800);
  },

  afterEach: (client, done) => {
    if (client.currentTest.results.failed) {
      throw new Error('Test Case failed, skipping all the rest');
    }
    done();
  },

  after: client => {
    client.end();
  },

  'Admin logs in': client => {
    const adminPage = client.page.admin();
    const { testData: { admin } } = client.globals;

    adminPage.navigateAndLogin(admin);
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
