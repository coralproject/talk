module.exports = {
  before: client => {
    client.setWindowPosition(0, 0);
    client.resizeWindow(1600, 1200);
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

  'admin logs in': client => {
    const adminPage = client.page.admin();
    const { testData: { admin } } = client.globals;

    adminPage.navigateAndLogin(admin);
  },
  'navigate to the embed stream': client => {
    const embedStream = client.page.embedStream();

    embedStream.navigate().ready();
  },
  'admin bans user': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments.section.mod
      .waitForElementVisible('@arrow')
      .click('@arrow')
      .waitForElementVisible('@menu')
      .waitForElementVisible('@banButton')
      .click('@banButton');

    embedStream
      .waitForElementVisible('@banDialog')
      .waitForElementVisible('@banDialogConfirmButton')
      .click('@banDialogConfirmButton')
      .waitForElementNotVisible('@banDialog');
  },
  'admin logs out': client => {
    const comments = client.page.embedStream().section.comments;

    comments.logout();
  },
  'user logs in': client => {
    const { testData: { user } } = client.globals;
    const comments = client.page.embedStream().section.comments;

    comments.openLoginPopup(popup => popup.login(user));
  },
  'user account is banned, should see restricted message box': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments.waitForElementVisible('@restrictedMessageBox');
  },
  'user logs out': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments.logout();
  },
  'admin logs in (2)': client => {
    const adminPage = client.page.admin();
    const { testData: { admin } } = client.globals;

    adminPage.navigateAndLogin(admin);
  },
  'admin goes to community': client => {
    const adminPage = client.page.admin();

    adminPage.goToCommunity().goToPeople();
  },
  'admin removes ban from user': client => {
    const people = client.page.admin().section.community.section.people;

    people
      .waitForElementVisible('@firstRow')
      .waitForElementVisible('@dropdownStatus')
      .click('@dropdownStatus')
      .waitForElementVisible('@dropdownStatusActive')
      .click('@optionRemoveBan');
  },
  'admin logs out 2': client => {
    client.page.admin().logout();
  },
  'navigate to the embed stream 2': client => {
    const embedStream = client.page.embedStream();

    embedStream.navigate().ready();
  },
  'user logs in 2': client => {
    const { testData: { user } } = client.globals;
    const comments = client.page.embedStream().section.comments;

    comments.openLoginPopup(popup => popup.login(user));
  },
  'user should be able to comment': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments
      .waitForElementVisible('@commentBoxTextarea')
      .waitForElementVisible('@commentBoxPostButton');
  },
};
