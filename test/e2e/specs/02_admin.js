module.exports = {
  '@tags': ['admin', 'login'],
   beforeEach: (client) => {

    client.resizeWindow(1024, 800);
  },
  'Admin logs in': (client) => {
    const adminPage = client.page.admin();
    const {testData: {admin}} = client.globals;

    adminPage
      .navigate()
      .ready()
      .login(admin);
  },

  'Admin goes to Stories': (client) => {
    const adminPage = client.page.admin();

    adminPage
      .waitForElementVisible('@drawerButton')
      .click('@drawerButton')
      .waitForElementVisible('@storiesDrawerNav')
      .click('@storiesDrawerNav')
      .waitForElementVisible('@drawerOverlay')
      .click('@drawerOverlay')
      .waitForElementVisible('@storiesSection');

  },

  'Admin goes to Community': (client) => {
    const adminPage = client.page.admin();

    adminPage
      .waitForElementVisible('@drawerButton')
      .click('@drawerButton')
      .waitForElementVisible('@communityDrawerNav')
      .click('@communityDrawerNav')
      .waitForElementVisible('@drawerOverlay')
      .click('@drawerOverlay')
      .waitForElementVisible('@communitySection');
  },

  after: (client) => {
    client.end();
  }
};
