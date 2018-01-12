const kue = require('../../services/kue');

beforeEach(() => {
  // Empty the test tasks before finishing.
  kue.TestQueue.splice(0, kue.TestQueue.length);
});
