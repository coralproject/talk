module.exports = {
  '@tags': ['admin', 'login'],
  'Admin logs in': (client) => {
    const adminPage = client.page.adminPage();
    const {testData} = client.globals;
    
    adminPage
      .waitForElementVisible('@loginLayout');

    console.log(testData);

  },
  after: (client) => {
    client.end();
  }
};
