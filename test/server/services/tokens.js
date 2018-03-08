const TokensService = require('../../../services/tokens');
const UsersService = require('../../../services/users');
const SettingsService = require('../../../services/settings');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('services.TokensService', () => {
  let user;
  beforeEach(async () => {
    await SettingsService.init();
    user = await UsersService.createLocalUser(
      'sockmonster@gmail.com',
      '2Coral!!',
      'Sockmonster'
    );
  });

  describe('#create', () => {
    it('can create the token without error', async () => {
      let token = await TokensService.create(user.id, 'Github Token');
      expect(token).to.be.an.object;
      expect(token.jwt).to.be.a.string;
      expect(token.pat).to.be.an.object;

      let pat = token.pat;

      let tokens = await TokensService.list(user.id);
      expect(tokens).to.have.length(1);
      expect(tokens[0]).to.have.property('id', pat.id);
      expect(tokens[0]).to.have.property('name', pat.name);
    });
  });

  describe('#revoke', () => {
    it('can revoke a token', async () => {
      let { pat: { id } } = await TokensService.create(user.id, 'Github Token');

      let tokens = await TokensService.list(user.id);
      expect(tokens).to.have.length(1);
      expect(tokens[0]).to.have.property('id', id);
      expect(tokens[0]).to.have.property('active', true);

      await TokensService.revoke(user.id, id);

      tokens = await TokensService.list(user.id);
      expect(tokens).to.have.length(1);
      expect(tokens[0]).to.have.property('id', id);
      expect(tokens[0]).to.have.property('active', false);
    });
  });

  describe('#validate', () => {
    it('will allow a valid token', async () => {
      // Create a token.
      let { pat: { id } } = await TokensService.create(user.id, 'Github Token');

      // Validate it.
      await TokensService.validate(user.id, id);
    });

    it('will not allow an invalid token', async () => {
      // Create a token.
      let { pat: { id } } = await TokensService.create(user.id, 'Github Token');

      // Revoke it.
      await TokensService.revoke(user.id, id);

      // Validate it.
      return TokensService.validate(user.id, id).should.eventually.be.rejected;
    });
  });

  describe('#list', () => {
    it('lists the tokens for a user', async () => {
      let tokens = await TokensService.list(user.id);
      expect(tokens).to.have.length(0);

      // Create a token.
      let { pat: { id } } = await TokensService.create(user.id, 'Github Token');

      tokens = await TokensService.list(user.id);
      expect(tokens).to.have.length(1);
      expect(tokens[0]).to.have.property('id', id);
    });
  });
});
