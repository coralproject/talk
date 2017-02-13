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

    embedStreamPage
      .signUp({
        email: `visitor_${Date.now()}@test.com`,
        username: `visitor${Date.now()}`,
        pass: 'testtest'
      });
  },
  after: client => {
    client.end();
  }
};
