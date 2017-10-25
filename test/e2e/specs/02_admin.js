module.exports = {
  '@tags': ['admin', 'login'],
  beforeEach: (client) => {

    // Testing Desktop
    client.resizeWindow(1280, 800);
  },
  'Admin logs in': (client) => {
    const adminPage = client.page.admin();
    const {testData: {admin}} = client.globals;

    adminPage
      .navigate()
      .waitForElementVisible('@loginLayout')
      .waitForElementVisible('@signInForm')
      .setValue('@emailInput', admin.email)
      .setValue('@passwordInput', admin.password)
      .waitForElementVisible('@signInButton')
      .click('@signInButton')
      .waitForElementVisible('@moderationContainer');
  },

  'Admin goes to Stories': (client) => {
    const adminPage = client.page.admin();

    adminPage
      .navigate()
      .waitForElementVisible('@storiesNav')
      .click('@storiesNav')
      .waitForElementVisible('@storiesSection');
  },

  'Admin goes to Community': (client) => {
    const adminPage = client.page.admin();

    adminPage
      .navigate()
      .waitForElementVisible('@communityNav')
      .click('@communityNav')
      .waitForElementVisible('@communitySection');      
  },
  after: (client) => {
    client.end();
  }
};
