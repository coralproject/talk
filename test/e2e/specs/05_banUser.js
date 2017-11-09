module.exports = {
  'admin logs in': (client) => {
    const adminPage = client.page.admin();
    const {testData: {admin}} = client.globals;

    adminPage
      .navigate()
      .ready()
      .login(admin);
  },
  'navigate to the embed stream': (client) => {
    const embedStream = client.page.embedStream();

    embedStream
      .navigate()
      .ready();
  },
  'admin bans user': (client) => {
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
  'admin logs out': (client) => {
    const comments = client.page.embedStream().section.comments;

    comments
      .logout();
  },
  'user logs in': (client) => {
    const {testData: {user}} = client.globals;
    const comments = client.page.embedStream().section.comments;

    comments
      .openLoginPopup((popup) => popup.login(user));
  },
  'user account is banned, should see restricted message box': (client) => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments
      .waitForElementVisible('@restrictedMessageBox');
  },
  'user logs out': (client) => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.section.comments;

    comments
      .logout();
  },
  'admin logs in (2)': (client) => {
    const adminPage = client.page.admin();
    const {testData: {admin}} = client.globals;

    adminPage
      .navigate()
      .ready()
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
