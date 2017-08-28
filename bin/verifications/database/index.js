// This will import all the verifications that should be run by the:
//
//   cli verify database
//
// command. They exist in the form:
//
//   async ({fix = false, batch = 1000}) => {}
//
// where their options are derrived.
module.exports = [
  require('./comments'),
];
