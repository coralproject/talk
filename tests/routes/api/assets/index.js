require('../../../utils/mongoose');
const passport = require('../../../utils/passport');

const chai = require('chai');
const server = require('../../../../app');

// Setup chai.
chai.should();
chai.use(require('chai-http'));

describe('Asset: routes', () => {

  describe('/GET Asset', () => {
    describe('#get', () => {
      it('It should get an empty array when there are no assets.', (done) => {

        chai.request(server)
          .get('/api/v1/asset')
          .set(passport.inject({roles: ['admin']}))
          .end((err, res) => {

            if (err) {
              throw new Error(err);
            }

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });

      });
    });
  });

});
