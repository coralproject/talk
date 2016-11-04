/* eslint-env node, mocha */

require('../utils/mongoose');
const Comment = require('../../models/comment');
const expect = require('chai').expect;

describe('Comment: models', () => {
  var mockComments
  beforeEach(() => {
    return Comment.create([{
      body: 'comment 1',
      asset_id: '123'
    },{
      body: 'comment 2',
      asset_id: '123'
    },{
      body: 'comment 3',
      asset_id: '456'
    }]).then((comments) => {
      mockComments = comments
    });
  });

  describe('#findById()', () => {
    it('should find a comment by id', () => {
      return Comment.findById(mockComments[0].id).then((result) => {
        expect(result).to.have.property('body')
          .and.to.equal('comment 1');
      });
    });
  });

  describe('#findByAssetId()', () => {
    it('should find an array of comments by asset id', () => {
      return Comment.findByAssetId('123').then((result) => {
        expect(result).to.have.length(2);
        expect(result[0]).to.have.property('body')
          .and.to.equal('comment 1');
        expect(result[1]).to.have.property('body')
          .and.to.equal('comment 2');
      });
    });
  });

  // });
});
