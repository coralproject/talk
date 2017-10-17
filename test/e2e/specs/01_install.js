module.exports = {
  '@tags': ['install'],
  'User goes to install': (client) => {
    const install = client.page.install();

    install
      .navigate()
      .ready();

  },
  'User clicks get started button': (client) => {
    const install = client.page.install();

    install
      .waitForElementVisible('@getStartedButton')
      .click('@getStartedButton');
  },
  'User should see step 2 - Add Organization Name': (client) => {
    const install = client.page.install();

    install
      .waitForElementVisible('@step2');
  },
  'User fills step 2': (client) => {
    const install = client.page.install();
    const {testData} = client.globals;

    install
      .waitForElementVisible('@step2organizationNameInput')
      .setValue('@step2organizationNameInput', testData.organizationName)
      .waitForElementVisible('@step2saveButton')
      .click('@step2saveButton');
  },
  'User should see step 3 - Create your account': (client) => {
    const install = client.page.install();

    install
      .waitForElementVisible('@step3');
  },
  'User fills step 3': (client) => {
    const install = client.page.install();
    const {testData: {admin}} = client.globals;

    install
      .setValue('@step3EmailInput', admin.email)
      .setValue('@step3UsernameInput', admin.username)
      .setValue('@step3PasswordInput', admin.password)
      .setValue('@step3ConfirmPasswordInput', admin.password)
      .waitForElementVisible('@step3saveButton')
      .click('@step3saveButton');
  },
  'User should see step 4 - Domain Whitelist': (client) => {
    const install = client.page.install();

    install
      .waitForElementVisible('@step4');
  },
  'User fills step 4': (client) => {
    const install = client.page.install();

    install
      .waitForElementVisible('@step4DomainInput')
      .setValue('@step4DomainInput', client.launchUrl);

    client.keys(client.Keys.ENTER);

    install
      .waitForElementVisible('@step4saveButton')
      .click('@step4saveButton');
  },
  after: (client) => {
    client.end();
  }
};
