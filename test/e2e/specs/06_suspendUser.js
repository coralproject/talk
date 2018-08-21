const printBrowserLog = require('../helpers/printBrowserLog');
const commentBody = 'Suspend User Test';

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
  'user logs in': client => {
    const {
      testData: { user },
    } = client.globals;
    const embedStream = client.page.embedStream();
    const comments = client.page.embedStream().section.comments;

    embedStream.navigate().ready();

    comments.openLoginPopup(popup => popup.login(user));
  },
  'user posts comment': client => {
    const comments = client.page.embedStream().section.comments;

    comments
      .waitForElementVisible('@commentBoxTextarea')
      .setValue('@commentBoxTextarea', commentBody)
      .waitForElementVisible('@commentBoxPostButton')
      .click('@commentBoxPostButton')
      .waitForElementVisible('@firstCommentContent')
      .getText('@firstCommentContent', result => {
        comments.assert.equal(result.value, commentBody);
      });
  },
  'user logs out': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments.logout();
  },
  'admin logs in': client => {
    const adminPage = client.page.admin();
    const {
      testData: { admin },
    } = client.globals;

    adminPage.navigateAndLogin(admin);
  },
  'navigate to the embed stream': client => {
    const embedStream = client.page.embedStream();

    embedStream.navigate().ready();
  },
  'admin reports comment': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments
      .waitForElementVisible('@firstComment')
      .waitForElementVisible('@flagButton')
      .click('@flagButton');

    comments.section.flag
      .waitForElementVisible('@flagCommentRadio')
      .click('@flagCommentRadio')
      .waitForElementVisible('@continueButton')
      .click('@continueButton')
      .waitForElementVisible('@spamCommentRadio')
      .click('@spamCommentRadio')
      .click('@continueButton')
      .waitForElementVisible('@popUpText')
      .click('@continueButton');
  },
  'admin suspends user': client => {
    const adminPage = client.page.admin();
    const { moderate, userDetailDrawer, suspendUserDialog } = adminPage.section;

    adminPage
      .navigate()
      .ready()
      .goToModerate();

    moderate
      .waitForElementVisible('@firstComment')
      .waitForElementVisible('@firstCommentUsername')
      .click('@firstCommentUsername');

    userDetailDrawer
      .waitForElementVisible('@actionsMenu')
      .click('@actionMenuButton')
      .waitForElementVisible('@actionItemSuspendUser')
      .click('@actionItemSuspendUser');

    suspendUserDialog
      .waitForElementVisible('@step0')
      .waitForElementVisible('@confirmButton')
      .click('@confirmButton')
      .waitForElementVisible('@step1')
      .waitForElementVisible('@sendButton')
      .click('@sendButton');

    adminPage
      .waitForElementVisible('@toast')
      .waitForElementVisible('@toastClose')
      .click('@toastClose');
  },
  'admin checks user status and ban and suspension history': client => {
    const adminPage = client.page.admin();
    const { moderate, userDetailDrawer } = adminPage.section;

    moderate
      .waitForElementVisible('@firstComment')
      .waitForElementVisible('@firstCommentUsername')
      .click('@firstCommentUsername');

    userDetailDrawer
      .waitForElementVisible('@tabBar')
      .waitForElementVisible('@allTab')
      .click('@allTab')
      .waitForElementVisible('@rejectedTab')
      .click('@rejectedTab')
      .waitForElementVisible('@historyTab')
      .click('@historyTab')
      .waitForElementVisible('@historyPane')
      .waitForElementVisible('@UserHistory')
      .click('@closeButton');
  },
  'admin logs out': client => {
    const adminPage = client.page.admin();

    adminPage.logout();
  },
  'user logs in (2)': client => {
    const {
      testData: { user },
    } = client.globals;
    const embedStream = client.page.embedStream();
    const comments = client.page.embedStream().section.comments;

    embedStream.navigate().ready();

    comments.openLoginPopup(popup => popup.login(user));
  },
  'user account is suspended, should see restricted message box': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments.waitForElementVisible('@restrictedMessageBox');
  },
};
