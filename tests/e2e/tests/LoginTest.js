module.exports = {
  '@tags': ['login'],
  before: client => {
    const {launchUrl} = client;

    client
      .url(launchUrl)
      .frame('coralStreamIframe');
  },
  'Commenter logs in': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .ready()
      .login();
  },
  after: client => {
    client.end();
  }
};
