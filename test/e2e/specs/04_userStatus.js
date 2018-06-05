const printBrowserLog = require('../helpers/printBrowserLog');

module.exports = {
  before: client => {
    client.setWindowPosition(0, 0);
    client.resizeWindow(1600, 1200);
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

  'Admin logs in': client => {
    const adminPage = client.page.admin();
    const {
      testData: { admin },
    } = client.globals;

    adminPage.navigateAndLogin(admin);
  },
  'Admin flags users username as offensive': client => {
    const embedStream = client.page.embedStream();

    const comments = embedStream.navigate().ready();

    comments
      .waitForElementVisible('@firstComment')
      .waitForElementVisible('@flagButton')
      .click('@flagButton');

    comments.section.flag
      .waitForElementVisible('@flagUsernameRadio')
      .click('@flagUsernameRadio')
      .waitForElementVisible('@continueButton')
      .click('@continueButton')
      .waitForElementVisible('@offensiveUsernameRadio')
      .click('@offensiveUsernameRadio')
      .click('@continueButton')
      .waitForElementVisible('@popUpText')
      .click('@continueButton');
  },
  'Admin goes to Reported Usernames': client => {
    const adminPage = client.page.admin();

    const community = adminPage
      .navigate()
      .ready()
      .goToCommunity();

    community
      .waitForElementVisible('@flaggedAccountsContainer')
      .waitForElementVisible('@flaggedUser');
  },
  'Admin rejects the user flag': client => {
    const community = client.page.admin().section.community;

    community
      .waitForElementVisible('@flaggedUserRejectButton')
      .click('@flaggedUserRejectButton');
  },
  'Admin continues the dialog and suspends the user': client => {
    const community = client.page.admin().section.community;
    const rejectReportedUsernameDialog = client.page.admin().section
      .rejectReportedUsernameDialog;

    rejectReportedUsernameDialog
      .waitForElementVisible('@buttons')
      .waitForElementVisible('@step0')
      .waitForElementVisible('@suspend')
      .click('@suspend')
      .waitForElementVisible('@step1')
      .waitForElementVisible('@suspend')
      .click('@suspend');

    community.waitForElementNotPresent('@flaggedUser');
  },
  'Admin logs out': client => {
    client.page.admin().logout();
  },
  'user logs in': client => {
    const {
      testData: { user },
    } = client.globals;
    const embedStream = client.page.embedStream();

    embedStream
      .navigate()
      .ready()
      .openLoginPopup(popup => popup.login(user));
  },
  'user account is suspended, should see restricted message box': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments.waitForElementVisible('@restrictedMessageBox');
  },
  'user should not be able to comment': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments
      .waitForElementNotPresent('@commentBoxTextarea')
      .waitForElementNotPresent('@commentBoxPostButton');
  },
  'user picks another username': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;
    const {
      testData: { user },
    } = client.globals;

    comments
      .waitForElementVisible('@changeUsernameInput')
      .setValue('@changeUsernameInput', `${user.username}_alternative`)
      .waitForElementVisible('@changeUsernameSubmitButton')
      .click('@changeUsernameSubmitButton')
      .waitForElementNotPresent('@changeUsernameInput');
  },
  'user should not be able to comment still': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments
      .waitForElementNotPresent('@commentBoxTextarea')
      .waitForElementNotPresent('@commentBoxPostButton');
  },
  'user logs out': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments.logout();
  },
  'Admin accepts the user flag': client => {
    const adminPage = client.page.admin();
    const {
      testData: { admin },
    } = client.globals;

    adminPage.navigateAndLogin(admin);

    const community = adminPage
      .navigate()
      .ready()
      .goToCommunity();

    community
      .waitForElementVisible('@flaggedAccountsContainer')
      .waitForElementVisible('@flaggedUser')
      .waitForElementVisible('@flaggedUserApproveButton')
      .click('@flaggedUserApproveButton');

    client.page.admin().logout();
  },
  'user logs in to check comment': client => {
    const {
      testData: { user },
    } = client.globals;
    const embedStream = client.page.embedStream();

    embedStream
      .navigate()
      .ready()
      .openLoginPopup(popup => popup.login(user));
  },
  'user should be able to comment': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments
      .waitForElementVisible('@commentBoxTextarea')
      .waitForElementVisible('@commentBoxPostButton');
  },
};
