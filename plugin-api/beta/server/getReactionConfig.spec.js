const getReactionConfig = require('./getReactionConfig');

describe('plugins-api', () => {
  describe('getReactionConfig', () => {
    let config;
    beforeEach(() => {
      config = getReactionConfig('heart');
    });

    describe('context', () => {
      it('provides a sort function', () => {
        expect(config.context.Sort).toBeInstanceOf(Function);
        const sort = config.context.Sort();
        expect(sort.Comments).toHaveProperty('hearts');
      });
    });

    describe('hooks', () => {
      it('handles the __resolveType properly', () => {
        expect(config.hooks.ActionSummary.__resolveType).toHaveProperty('post');
        expect(config.hooks.ActionSummary.__resolveType.post).toBeInstanceOf(
          Function
        );
        expect(
          config.hooks.ActionSummary.__resolveType.post({})
        ).toBeUndefined();
        expect(
          config.hooks.ActionSummary.__resolveType.post({ action_type: 'LOVE' })
        ).toBeUndefined();
        expect(
          config.hooks.ActionSummary.__resolveType.post({
            action_type: 'HEART',
          })
        ).toEqual('HeartActionSummary');
      });
      it('handles the __resolveType properly', () => {
        expect(config.hooks.Action.__resolveType).toHaveProperty('post');
        expect(config.hooks.Action.__resolveType.post).toBeInstanceOf(Function);
        expect(config.hooks.Action.__resolveType.post({})).toBeUndefined();
        expect(
          config.hooks.Action.__resolveType.post({ action_type: 'LOVE' })
        ).toBeUndefined();
        expect(
          config.hooks.Action.__resolveType.post({
            action_type: 'HEART',
          })
        ).toEqual('HeartAction');
      });
    });
  });
});
