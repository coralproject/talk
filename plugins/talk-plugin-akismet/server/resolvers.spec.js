const resolvers = require('./resolvers');

describe('talk-plugin-akismet', () => {
  describe('resolvers', () => {
    it('resolves when there is a akismet value', () => {
      const spam = resolvers.Comment.spam({ metadata: { akismet: true } });
      expect(spam).toEqual(true);
    });
    it('resolves when there not is a akismet value', () => {
      const spam = resolvers.Comment.spam({});
      expect(spam).toEqual(null);
    });
  });
});
