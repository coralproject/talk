export default {
  '@tags': ['flag', 'comments', 'visitor'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .navigate()
      .ready();
  },
  'Visitor tries to flag a comment': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .flagComment()
      .waitForElementVisible('@signInDialog', 2000);
  },
  after: client => {
    client.end();
  }
};
