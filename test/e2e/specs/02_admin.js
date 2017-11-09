module.exports = {
  '@tags': ['admin', 'login'],
   beforeEach: (client) => {

    client.resizeWindow(1024, 800);
  },
  'Admin logs in': (client) => {
    const adminPage = client.page.admin();
    const {testData: {admin}} = client.globals;

    adminPage.navigate();
    adminPage.expect.section('@login').to.be.present;
    adminPage.section.login.login(admin);
  },

  'Admin goes to Stories': (client) => {
    const adminPage = client.page.admin();

    adminPage
      .openDrawer()
        .goToStories();
  },

  'Admin goes to Community': (client) => {
    const adminPage = client.page.admin();

    adminPage
      .openDrawer()
        .goToCommunity();
  },

  after: (client) => {
    client.end();
  }
};
