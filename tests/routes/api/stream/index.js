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
      moderation: 'post',
      wordlist: {
        banned: ['banned'],
        suspect: ['suspect']
      }
    };

    const assets = [
      {
        url: 'https://example.com/article/1'
      },
      {
        url: 'https://example.com/article/2',
        settings: {
          moderation: 'pre'
        }
      },
      {
        url: 'https://example.com/article/3'
      }
    ];

    const comments = [{
      id: 'abc',
      body: 'comment 10',
      author_id: '',
      parent_id: '',
      status: 'accepted',
      status_history: [{
        type: 'accepted'
      }]
    }, {
      id: 'def',
      body: 'comment 20',
      author_id: '',
      parent_id: '',
      status: null,
      status_history: []
    }, {
      id: 'uio',
      body: 'comment 30',
      asset_id: 'asset',
      author_id: '456',
      parent_id: '',
      status: 'accepted',
      status_history: [{
        type: 'accepted'
      }]
    }, {
      id: 'hij',
      body: 'comment 40',
      asset_id: '456',
      status: 'rejected',
      status_history: [{
        type: 'rejected'
      }]
    }, {
      body: 'comment 50',
      status: 'premod',
      status_history: [{
        type: 'premod'
      }]
    }, {
      body: 'comment 60',
      status: 'accepted',
      status_history: [{
        type: 'accepted'
      }]
    }, {
      body: 'comment 70',
      status: 'rejected',
      status_history: [{
        type: 'rejected'
      }]
    }, {
      body: 'comment 70',
      status: null,
      status_history: []
    }];

    const users = [{
      displayName: 'Ana',
      email: 'ana@gmail.com',
      password: '123456789'
    }, {
      displayName: 'Maria',
      email: 'maria@gmail.com',
      password: '123456789'
    }];

    const actions = [{
      action_type: 'flag',
      item_id: 'abc'
    }, {
      action_type: 'like',
      item_id: 'hij'
    }];

    beforeEach(() => {
      return Setting.init(settings)
      .then(() => Promise.all([
        User.createLocalUsers(users),
        Promise.all(assets.map((asset) => Asset.create(asset)))
      ]))
      .then(([mockUsers, mockAssets]) => {

        // Map the id's over.
        mockAssets.forEach((asset, i) => {
          assets[i].id = asset.id;
        });

        mockUsers.forEach((user, i) => {
          users[i].id = user.id;
        });

        comments.forEach((comment, i) => {
          comments[i].author_id = users[(i % 2) === 0 ? 0 : 1].id;
        });

        comments[0].asset_id = assets[0].id;
        comments[1].asset_id = assets[0].id;
        comments[2].asset_id = assets[1].id;
        comments[3].asset_id = assets[1].id;
        comments[4].asset_id = assets[2].id;
        comments[5].asset_id = assets[2].id;
        comments[6].asset_id = assets[2].id;
        comments[7].asset_id = assets[2].id;

        return Promise.all([
          Comment.create(comments),
          Action.create(actions)
        ]);
      });
    });

    it('should return a stream with comments, users and actions for an existing asset', () => {
      return chai.request(app)
        .get('/api/v1/stream')
        .query({asset_url: assets[0].url})
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
        .query({asset_url: assets[1].url})
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.assets).to.have.length(1);
          expect(res.body.comments).to.have.length(1);
          expect(res.body.users).to.have.length(1);
          expect(res.body.settings).to.have.property('moderation', 'pre');
          expect(res.body.settings).to.not.have.property('wordlist');
        });
    });

    it('should not change the previously displayed comments based on moderation state changes', () => {

      let preComments, postComments;

      return chai.request(app)
        .get('/api/v1/stream')
        .query({asset_url: assets[2].url})
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.comments.length).to.equal(2);
          expect(res.body.settings).to.have.property('moderation', 'post');

          preComments = res.body.comments;

          return Asset.overrideSettings(assets[2].id, {moderation: 'pre'});
        })
        .then(() => {
          return chai.request(app)
            .get('/api/v1/stream')
            .query({asset_url: assets[2].url});
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.comments.length).to.equal(2);
          expect(res.body.settings).to.have.property('moderation', 'pre');

          postComments = res.body.comments;

          expect(preComments).to.deep.equal(postComments);
        });
    });
  });
});
