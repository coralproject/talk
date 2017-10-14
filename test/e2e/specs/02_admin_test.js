module.exports = {
  '@tags': ['admin', 'login'],
  'Admin logs in': (client) => {
    const adminPage = client.page.adminPage();
    const {testData} = client.globals;
    
    adminPage
      .waitForElementVisible('@loginLayout')
      .waitForElementVisible('@signInForm')
      .setValue('@emailInput', testData.email)
      .setValue('@passwordInput', testData.password)
      .waitForElementVisible('@signInButton')
      .click('@signInButton');

  },
  after: (client) => {
    client.end();
  }
};
