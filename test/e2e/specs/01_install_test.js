const uuid = require('uuid');
const {murmur3} = require('murmurhash-js');

const rHash = murmur3(uuid.v4());

const testData = {
  organizationName: 'Coral',
  email: `test_${rHash}@test.test`,
  username: `test${rHash}`,
  password: `testpassword${rHash}`,
  domain: 'http://localhost:3000'
};

module.exports = {
  '@tags': ['install'],
  'User goes to install': (client) => {
    const installPage = client.page.installPage();
    
    installPage
      .navigate()
      .ready();

  },
  'User clicks get started button': (client) => {
    const installPage = client.page.installPage();
    
    installPage
      .waitForElementVisible('@getStartedButton')
      .click('@getStartedButton');
  },
  'User should see step 2 - Add Organization Name': (client) => {
    const installPage = client.page.installPage();
    
    installPage
      .waitForElementVisible('@step2');
  },
  'User fills step 2': (client) => {
    const installPage = client.page.installPage();
    
    installPage
      .waitForElementVisible('@step2organizationNameInput')
      .setValue('@step2organizationNameInput', testData.organizationName)
      .waitForElementVisible('@step2saveButton')
      .click('@step2saveButton');
  },
  'User should see step 3 - Create your account': (client) => {
    const installPage = client.page.installPage();
    
    installPage
      .waitForElementVisible('@step3');
  },
  'User fills step 3': (client) => {
    const installPage = client.page.installPage();
    
    installPage
      .setValue('@step3EmailInput', testData.email)
      .setValue('@step3UsernameInput', testData.username)
      .setValue('@step3PasswordInput', testData.password)
      .setValue('@step3ConfirmPasswordInput', testData.password)
      .waitForElementVisible('@step3saveButton')
      .click('@step3saveButton');
  },
  'User should see step 4 - Domain Whitelist': (client) => {
    const installPage = client.page.installPage();
    
    installPage
      .waitForElementVisible('@step4');
  },
  'User fills step 4': (client) => {
    const installPage = client.page.installPage();
    
    installPage
      .waitForElementVisible('@step4DomainInput')
      .setValue('@step4DomainInput', testData.domain);

    client.keys(client.Keys.ENTER);
    
    installPage
      .waitForElementVisible('@step4saveButton')
      .click('@step4saveButton');
  },
  after: (client) => {
    client.end();
  }
};
