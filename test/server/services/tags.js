const CommentsService = require('../../../services/comments');
const TagsService = require('../../../services/tags');
const UsersService = require('../../../services/users');
const SettingsService = require('../../../services/settings');

const CommentModel = require('../../../models/comment');

const chai = require('chai');
const expect = chai.expect;

describe('services.TagsService', () => {
  let comment, user;
  beforeEach(async () => {
    await SettingsService.init();
    user = await UsersService.createLocalUser(
      'stampi@gmail.com',
      '1Coral!!',
      'Stampi'
    );
    comment = await CommentModel.create({
      id: '1',
      body: 'comment 10',
      asset_id: '123',
      status_history: [],
      parent_id: null,
      author_id: user.id,
    });
  });

  describe('#add', () => {
    it('adds a tag', async () => {
      const id = comment.id;
      const name = 'BEST';
      const assigned_by = user.id;

      await TagsService.add(id, 'COMMENTS', {
        tag: {
          name,
        },
        assigned_by,
      });

      const { tags } = await CommentsService.findById(id);
      expect(tags.length).to.equal(1);
      expect(tags[0].tag.name).to.equal(name);
      expect(tags[0].assigned_by).to.equal(assigned_by);
    });

    it("can't add same tag.id twice", async () => {
      const id = comment.id;
      const name = 'BEST';
      const assigned_by = user.id;

      await TagsService.add(id, 'COMMENTS', {
        tag: {
          name,
        },
        assigned_by,
      });

      {
        let { tags } = await CommentsService.findById(id);
        expect(tags.length).to.equal(1);
      }

      await TagsService.add(id, 'COMMENTS', {
        tag: {
          name,
        },
        assigned_by,
      });

      {
        let { tags } = await CommentsService.findById(id);
        expect(tags.length).to.equal(1);
      }
    });
  });

  describe('#remove', () => {
    it('removes a tag', async () => {
      const id = comment.id;
      const name = 'BEST';
      const assigned_by = user.id;

      await TagsService.add(id, 'COMMENTS', {
        tag: {
          name,
        },
        assigned_by,
      });

      {
        const { tags } = await CommentsService.findById(id);
        expect(tags.length).to.equal(1);
      }

      // ok now to remove it
      await TagsService.remove(id, 'COMMENTS', {
        tag: {
          name,
        },
        assigned_by,
      });

      {
        const { tags } = await CommentsService.findById(id);
        expect(tags.length).to.equal(0);
      }
    });
    it('removes a tag out of 2', async () => {
      const id = comment.id;
      const name = 'BEST';
      const assigned_by = user.id;

      await TagsService.add(id, 'COMMENTS', {
        tag: {
          name: 'ANOTHER',
        },
        assigned_by,
      });

      await TagsService.add(id, 'COMMENTS', {
        tag: {
          name,
        },
        assigned_by,
      });

      {
        const { tags } = await CommentsService.findById(id);
        expect(tags.length).to.equal(2);
      }

      // ok now to remove it
      await TagsService.remove(id, 'COMMENTS', {
        tag: {
          name,
        },
        assigned_by,
      });

      {
        const { tags } = await CommentsService.findById(id);
        expect(tags.length).to.equal(1);
        expect(tags[0].tag.name).to.equal('ANOTHER');
      }
    });
  });
});
