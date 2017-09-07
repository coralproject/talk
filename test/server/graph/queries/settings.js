const {graphql} = require('graphql');

const schema = require('../../../../graph/schema');
const Context = require('../../../../graph/context');
const SettingsService = require('../../../../services/settings');
const UserModel = require('../../../../models/user');

const {expect} = require('chai');

const defaultSettings = {
  organizationName: 'The Coral Project'
};

describe('graph.queries.settings', () => {
  let settings;
  beforeEach(async () => {
    settings = await SettingsService.init(defaultSettings);
  });

  const QUERY = `
  {
    settings {
      moderation
      requireEmailConfirmation
      infoBoxEnable
      infoBoxContent
      questionBoxEnable
      questionBoxContent
      premodLinksEnable
      questionBoxIcon
      autoCloseStream
      customCssUrl
      closedTimeout
      closedMessage
      charCountEnable
      charCount
      organizationName
      wordlist {
        banned
        suspect
      }
      domains {
        whitelist
      }
    }
  }
  `;

  describe('context with different user roles', () => {

    const BLACKLISTED_PROPERTIES = [
      'premodLinksEnable',
      'autoCloseStream',
      'wordlist',
      'domains',
    ];

    [
      {bl: true},
      {bl: true, roles: []},
      {bl: false, roles: ['ADMIN']},
      {bl: false, roles: ['ADMIN', 'MODERATOR']},
      {bl: false, roles: ['MODERATOR']},
    ].forEach(({bl, roles}) => {
      it(roles && roles.length > 0 ? roles.join(', ') : '<None>', async () => {
        let user;
        if (roles != null) {
          user = new UserModel({roles});
        }

        const ctx = new Context({user});

        const res = await graphql(schema, QUERY, {}, ctx);
        if (res.errors) {
          console.error(res.errors);
        }

        expect(res.errors).to.be.empty;
        expect(res.data.settings).to.be.object;
        Object.keys(res.data.settings).forEach((key) => {
          if (bl && BLACKLISTED_PROPERTIES.includes(key)) {
            expect(res.data.settings).to.have.property(key, null);
            return;
          }

          if (typeof settings[key] !== 'object') {
            expect(res.data.settings).to.have.property(key, settings[key]);
          } else {
            expect(res.data.settings).to.have.property(key);
            expect(res.data.settings[key]).to.not.be.null;
          }
        });
      });
    });
  });

});
