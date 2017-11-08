module.exports = {
  'admin logs in': (client) => {
    const adminPage = client.page.admin();
    const {testData: {admin}} = client.globals;

    adminPage
      .login(admin);
  },
  'navigate to the embed stream': (client) => {
    const embedStream = client.page.embedStream();

    embedStream
      .navigate()
      .getEmbedSection();
  },
  'admin bans user': (client) => {
    const embed = client.page.embedStream().section.embed;
    const modSection = client.page.embedStream().section.embed.section.mod;

    modSection
      .waitForElementVisible('@arrow')
      .click('@arrow')
      .waitForElementVisible('@menu')
      .waitForElementVisible('@banButton')
      .click('@banButton');

    embed
      .waitForElementVisible('@banDialog')
      .waitForElementVisible('@banDialogConfirmButton')
      .click('@banDialogConfirmButton')
      .waitForElementNotVisible('@banDialog');
  },
  'admin logs out': (client) => {
    const embedStream = client.page.embedStream();

    embedStream
      .logout();
  },
  'user logs in': (client) => {
    const {testData: {user}} = client.globals;
    const embedStream = client.page.embedStream();

    embedStream
      .login(user);
  },
  'user account is banned, should see restricted message box': (client) => {
    const embedStream = client.page.embedStream();

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    embed
      .waitForElementVisible('@restrictedMessageBox');
  },
  'user logs out': (client) => {
    const embedStream = client.page.embedStream();

    embedStream
      .logout();
  },
  'admin logs in (2)': (client) => {
    const adminPage = client.page.admin();
    const {testData: {admin}} = client.globals;

    adminPage
      .login(admin);
  },
  'admin goes to community': (client) => {
    const community = client.page.adminCommunity();
    
    community
      .goToPeople();
  },
  'admin removes ban from user': (client) => {
    const modSection = client.page.adminCommunity().section.people;

    modSection
      .waitForElementVisible('@firstRow')
      .waitForElementVisible('@dropdownStatus')
      .click('@dropdownStatus')
      .waitForElementVisible('@dropdownStatusActive')
      .click('@optionActive');
  },
};
