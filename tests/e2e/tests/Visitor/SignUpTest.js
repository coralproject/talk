module.exports = {
  '@tags': ['signup', 'visitor'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .navigate()
      .ready();
  },
  'Visitor signs up': client => {
    const embedStreamPage = client.page.embedStreamPage();
    const hash = Math.floor(Math.random() * (999 - 0));

    embedStreamPage
      .signUp({
        email: `visitor_${hash}@test.com`,
        displayName: 'Visitor',
        pass: 'testtest'
      });
  },
  after: client => {
    client.end();
  }
};
