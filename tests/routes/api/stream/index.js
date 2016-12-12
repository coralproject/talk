const app = require('../../../../app');
const chai = require('chai');
const expect = chai.expect;

// Setup chai.
chai.should();
chai.use(require('chai-http'));

const Action = require('../../../../models/action');
const User = require('../../../../models/user');
const Comment = require('../../../../models/comment');
const Asset = require('../../../../models/asset');

const Setting = require('../../../../models/setting');

describe('/api/v1/stream', () => {
  describe('#get', () => {
    const settings = {
      id: '1',
      moderation: 'post'
    };

    const comments = [{
      id: 'abc',
      body: 'comment 10',
      author_id: '',
      parent_id: '',
      status_history: [{
        type: 'accepted'
      }]
    }, {
      id: 'def',
      body: 'comment 20',
      author_id: '',
      parent_id: '',
      status_history: []
    }, {
      id: 'uio',
      body: 'comment 30',
      asset_id: 'asset',
      author_id: '456',
      parent_id: '',
      status_history: [{
        type: 'accepted'
      }]
    }, {
      id: 'hij',
      body: 'comment 40',
      asset_id: '456',
      status_history: [{
        type: 'rejected'
      }]
    }];

    const users = [{
      displayName: 'Ana',
      email: 'ana@gmail.com',
      password: '123'
    }, {
      displayName: 'Maria',
      email: 'maria@gmail.com',
      password: '123'
    }];

    const actions = [{
      action_type: 'flag',
      item_id: 'abc'
    }, {
      action_type: 'like',
      item_id: 'hij'
    }];

    beforeEach(() => {
      return Promise.all([
        User.createLocalUsers(users),
        Asset.findOrCreateByUrl('http://test.com'),
        Asset
          .findOrCreateByUrl('http://coralproject.net/asset2')
          .then((asset) => {
            return Asset
              .overrideSettings(asset.id, {moderation: 'pre'})
              .then(() => asset);
          })
      ])
      .then(([users, asset1, asset2]) => {

        comments[0].author_id = users[0].id;
        comments[1].author_id = users[1].id;
        comments[2].author_id = users[0].id;
        comments[3].author_id = users[1].id;

        comments[0].asset_id = asset1.id;
        comments[1].asset_id = asset1.id;
        comments[2].asset_id = asset2.id;
        comments[3].asset_id = asset2.id;

        return Promise.all([
          Comment.create(comments),
          Action.create(actions),
          Setting.init(settings)
        ]);
      });
    });

    it('should return a stream with comments, users and actions for an existing asset', () => {
      return chai.request(app)
        .get('/api/v1/stream')
        .query({'asset_url': 'http://test.com'})
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.assets.length).to.equal(1);
          expect(res.body.comments.length).to.equal(2);
          expect(res.body.users.length).to.equal(2);
          expect(res.body.actions.length).to.equal(1);
          expect(res.body.settings).to.have.property('moderation', 'post');
        });
    });

    it('should reject requests without a scheme in the asset_url', () => {
      return chai.request(app)
        .get('/api/v1/stream')
        .query({asset_url: 'test.com'})
        .catch((err) => {
          expect(err).to.have.status(400);
          expect(err.response.body.message).to.contain('asset_url is invalid');
        });
    });

    it('should merge the settings when the asset contains settings to override it with', () => {
      return chai.request(app)
        .get('/api/v1/stream')
        .query({'asset_url': 'http://coralproject.net/asset2'})
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.assets.length).to.equal(1);
          expect(res.body.comments.length).to.equal(1);
          expect(res.body.users.length).to.equal(1);
          expect(res.body.settings).to.have.property('moderation', 'pre');
          expect(res.body.settings).to.not.have.property('wordlist');
        });
    });
  });
});
