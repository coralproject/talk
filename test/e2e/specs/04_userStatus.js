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
  'admin flags users username as offensive': client => {
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
  'admin goes to Reported Usernames': client => {
    const adminPage = client.page.admin();

    const community = adminPage
      .navigate()
      .ready()
      .goToCommunity();

    community
      .waitForElementVisible('@flaggedAccountsContainer')
      .waitForElementVisible('@flaggedUser');
  },
  'admin rejects the user flag': client => {
    const community = client.page.admin().section.community;

    community
      .waitForElementVisible('@flaggedUserRejectButton')
      .click('@flaggedUserRejectButton');
  },
  'admin suspends the user': client => {
    const community = client.page.admin().section.community;
    const usernameDialog = client.page.admin().section.usernameDialog;

    usernameDialog
      .waitForElementVisible('@buttons')
      .waitForElementVisible('@step0')
      .waitForElementVisible('@suspend')
      .click('@suspend')
      .waitForElementVisible('@step1')
      .waitForElementVisible('@suspend')
      .click('@suspend');

    community.waitForElementNotPresent('@flaggedUser');
  },
  'admin logs out': client => {
    client.page.admin().logout();
  },
  'user logs in': client => {
    const { testData: { user } } = client.globals;
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
    const { testData: { user } } = client.globals;

    comments
      .waitForElementVisible('@changeUsernameInput')
      .setValue('@changeUsernameInput', `${user.username}_alternative`)
      .waitForElementVisible('@changeUsernameSubmitButton')
      .click('@changeUsernameSubmitButton')
      .waitForElementNotPresent('@changeUsernameInput');
  },
  'user should be able to comment': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments
      .waitForElementVisible('@commentBoxTextarea')
      .waitForElementVisible('@commentBoxPostButton');
  },
};
