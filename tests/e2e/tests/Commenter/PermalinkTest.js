export default {
  '@tags': ['permalink', 'commenter'],
  'Permalink': () => {
  },
  after: client => {
    client.end();
  }
};
