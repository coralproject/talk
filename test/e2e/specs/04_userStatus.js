module.exports = {
  'admin logs in': (client) => {
    const adminPage = client.page.admin();
    const {testData: {admin}} = client.globals;

    adminPage
      .navigate()
      .ready()
      .login(admin);
  },
  'admin flags user\'s username as offensive': (client) => {
    const embedStream = client.page.embedStream();

    const comments = embedStream
      .navigate()
      .ready();

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
  'admin goes to Reported Usernames': (client) => {
    const community = client.page.adminCommunity();

    community
      .navigate();

    community
      .waitForElementVisible('@container')
      .waitForElementVisible('@flaggedAccountsContainer')
      .waitForElementVisible('@flaggedUser');
  },
  'admin rejects the user flag': (client) => {
    const community = client.page.adminCommunity();

    community
      .waitForElementVisible('@flaggedUserRejectButton')
      .click('@flaggedUserRejectButton');
  },
  'admin suspends the user': (client) => {
    const community = client.page.adminCommunity();

    community
      .waitForElementVisible('@usernameDialog')
      .waitForElementVisible('@usernameDialogButtons')
      .waitForElementVisible('@usernameDialogSuspend')
      .click('@usernameDialogSuspend')
      .waitForElementVisible('@usernameDialogSuspensionMessage')
      .click('@usernameDialogSuspend')
      .waitForElementNotPresent('@flaggedUser');
  },
  'admin logs out': (client) => {
    const admin = client.page.admin();

    admin
      .waitForElementVisible('@settingsButton')
      .click('@settingsButton')
      .waitForElementVisible('@signOutButton')
      .click('@signOutButton');
  },
  'user logs in': (client) => {
    const {testData: {user}} = client.globals;
    const embedStream = client.page.embedStream();

    embedStream
      .navigate()
      .ready()
      .openLoginPopup((popup) => popup.login(user));
  },
  'user account is suspended, should see restricted message box': (client) => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments
      .waitForElementVisible('@restrictedMessageBox');
  },
  'user picks another username': (client) => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;
    const {testData: {user}} = client.globals;

    comments
      .waitForElementVisible('@suspendedAccountInput')
      .setValue('@suspendedAccountInput', `${user.username}-alternative`)
      .waitForElementVisible('@suspendedAccountSubmitButton')
      .click('@suspendedAccountSubmitButton');
  },
  'user should not be able to comment': (client) => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments
      .waitForElementNotPresent('@commentBoxTextarea')
      .waitForElementNotPresent('@commentBoxPostButton');
  },
  after: (client) => {
    client.end();
  }
};
