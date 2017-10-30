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
      .waitForElementVisible('@container');
  },
  after: (client) => {
    client.end(); 
  }
};
