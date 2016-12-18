module.exports = {
  '@tags': ['like', 'comments', 'visitor'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .navigate()
      .ready();
  },
  'Visitor tries to like a comment': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .visitorLikeComment();
  },
  after: client => {
    client.end();
  }
};
