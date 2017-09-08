const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const UserModel = require('../../../../models/user');
const SettingsService = require('../../../../services/settings');

const {expect} = require('chai');

describe('graph.mutations.updateWordlist', () => {
  beforeEach(async () => {
    await SettingsService.init();
  });

  const QUERY = `
  mutation UpdateWordlist($wordlist: UpdateWordlistInput!) {
    updateWordlist(input: $wordlist) {
      errors {
        translation_key
      }
    }
  }
`;

  describe('context with different user roles', () => {

    [
      {error: 'NOT_AUTHORIZED'},
      {error: 'NOT_AUTHORIZED', roles: []},
      {roles: ['ADMIN']},
      {roles: ['ADMIN', 'MODERATOR']},
      {roles: ['MODERATOR']},
    ].forEach(({roles, error}) => {
      it(roles && roles.length > 0 ? roles.join(', ') : '<None>', async () => {
        let user;
        if (roles != null) {
          user = new UserModel({roles});
        }
        const ctx = new Context({user});

        const wordlist = {
          banned: [
            'happy',
          ],
          suspect: [
            'sad',
          ],
        };

        const res = await graphql(schema, QUERY, {}, ctx, {
          wordlist,
        });
        if (res.errors) {
          console.error(res.errors);
        }
        expect(res.errors).to.be.empty;

        if (error) {
          expect(res.data.updateWordlist.errors).to.not.be.empty;
          expect(res.data.updateWordlist.errors[0]).to.have.property('translation_key', error);

          const {wordlist: retrievedWordlist} = await SettingsService.retrieve();
          expect(retrievedWordlist).to.have.property('banned');
          expect(retrievedWordlist.banned).to.have.members([]);
          expect(retrievedWordlist).to.have.property('suspect');
          expect(retrievedWordlist.suspect).to.have.members([]);
        } else {
          if (res.data.updateWordlist && res.data.updateWordlist.errors) {
            console.error(res.data.updateWordlist.errors);
          }
          expect(res.data.updateWordlist).to.be.null;

          const {wordlist: retrievedWordlist} = await SettingsService.retrieve();
          expect(retrievedWordlist).to.have.property('banned');
          expect(retrievedWordlist.banned).to.have.members(wordlist.banned);
          expect(retrievedWordlist).to.have.property('suspect');
          expect(retrievedWordlist.suspect).to.have.members(wordlist.suspect);
        }
      });
    });
  });
});
