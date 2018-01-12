// This will import all the verifications that should be run by the:
//
//   cli verify database
//
// command. They exist in the form:
//
//   async ({fix = false, batch = 1000}) => {}
//
// where their options are derived.
module.exports = [require('./comment_replies'), require('./action_counts')];
