const mongoose = require('../helpers/mongoose');

before(function(done) {
  this.timeout(30000);

  mongoose.waitTillConnect(done);
});

beforeEach(function(done) {
  mongoose.clearDB(done);
});

after(function(done) {
  mongoose.disconnect(done);
});
