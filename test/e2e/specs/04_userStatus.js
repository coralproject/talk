module.exports = {
  'admin logs in': (client) => {
    const adminPage = client.page.admin();
    const {testData: {admin}} = client.globals;

    adminPage
      .navigate()
      .waitForElementVisible('@loginLayout')
      .waitForElementVisible('@signInForm')
      .setValue('@emailInput', admin.email)
      .setValue('@passwordInput', admin.password)
      .waitForElementVisible('@signInButton')
      .click('@signInButton');

    client.pause(3000);
    
    adminPage
      .waitForElementVisible('@moderationContainer');
  },
  'admin flags user\'s username as offensive': (client) => {
    const embedStream = client.page.embedStream();
    const flagSection = client.page.embedStream().section.embed.section.flag;

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    embed
      .waitForElementVisible('@firstComment')
      .waitForElementVisible('@flagButton')
      .click('@flagButton');

    flagSection
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

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    embed
      .waitForElementVisible('@signInButton')
      .click('@signInButton');

    client.pause(3000);

    // Focusing on the Login PopUp
    client.windowHandles((result) => {
      const handle = result.value[1];
      client.switchWindow(handle);
    });

    const login = client.page.login();

    login
      .setValue('@emailInput', user.email)
      .setValue('@passwordInput', user.password)
      .waitForElementVisible('@signIn')
      .waitForElementVisible('@loginButton')
      .click('@loginButton');

    // Focusing on the Embed Window
    client.windowHandles((result) => {
      const handle = result.value[0];
      client.switchWindow(handle);
    });
  },
  'user account is suspended, should see restricted message box': (client) => {
    const embedStream = client.page.embedStream();

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    embed
      .waitForElementVisible('@restrictedMessageBox');
  },

  'user picks another username': (client) => {
    const {testData: {user}} = client.globals;
    const embedStream = client.page.embedStream();
    
    const embed = embedStream
      .navigate()
      .getEmbedSection();

    embed
      .waitForElementVisible('@suspendedAccountInput')
      .setValue('@suspendedAccountInput', `${user.username}-alternative`)
      .waitForElementVisible('@suspendedAccountSubmitButton')
      .click('@suspendedAccountSubmitButton');
  },
  'user should not be able to comment': (client) => {
    const embedStream = client.page.embedStream();
    
    const embed = embedStream
      .navigate()
      .getEmbedSection();

    embed
      .waitForElementNotPresent('@commentBoxTextarea')
      .waitForElementNotPresent('@commentBoxPostButton');
  },
  after: (client) => {
    client.end(); 
  }
};
