export default {
  '@tags': ['flag', 'comments', 'username', 'commenter'],
  'Commenter flags a username': () => {
  },
  after: client => {
    client.end();
  }
};
