const printBrowserLog = require('../helpers/printBrowserLog');
const commentBody = 'Ban User Test';

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
    const {
      testData: { user },
    } = client.globals;
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
    const {
      testData: { admin },
    } = client.globals;

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
      .waitForElementVisible('@optionRemoveBan')
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
    const {
      testData: { user },
    } = client.globals;
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
  'user posts comment, karma should stop it from happening': client => {
    const comments = client.page.embedStream().section.comments;

    comments
      .waitForElementVisible('@commentBoxTextarea')
      .setValue('@commentBoxTextarea', commentBody)
      .waitForElementVisible('@commentBoxPostButton')
      .click('@commentBoxPostButton');

    client.pause(2000);

    comments.waitForElementNotPresent('@firstCommentContent');
  },
  'user logs out 3': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments.logout();
  },
  'admin logs in (3)': client => {
    const adminPage = client.page.admin();
    const {
      testData: { admin },
    } = client.globals;

    adminPage.navigateAndLogin(admin);
  },
  'admin goes to moderation queue reported': client => {
    const adminPage = client.page.admin();

    adminPage.goToModerate().goToQueue('reported');
  },
  'comment should be in reported queue': client => {
    const moderate = client.page.admin().section.moderate;

    moderate
      .waitForElementVisible('@firstComment')
      .getText('@firstCommentContent', result => {
        moderate.assert.equal(result.value, commentBody);
      });
  },
  'approve comment to restore karma': client => {
    const moderate = client.page.admin().section.moderate;

    moderate
      .click('@firstCommentApprove')
      .waitForElementNotPresent('@firstComment');
  },
};
