//  Modified from https://github.com/elliotf/mocha-mongoose

var mongoose = require('mongoose');


// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

beforeEach(function (done) {
  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  }


  if (mongoose.connection.readyState === 0) {
    mongoose.connect('coral-talk-test', function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  } else {
    return clearDB();
  }
});

after(function (done) {
  mongoose.disconnect();
  return done();
});
