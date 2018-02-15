const mailer = require('../services/mailer');
const debug = require('debug')('talk:jobs:mailer');
const Context = require('../graph/context');

/**
 * Start the queue processor for the mailer job.
 */
module.exports = () => {
  debug(`Now processing ${mailer.task.name} jobs`);

  return mailer.task.process(async ({ id, data }, done) => {
    const { email, user, message } = data;

    debug(`Starting to send mail for Job[${id}]`);

    // If the message has a specific email already to sent it to, just assign
    // that to the message. If the email does not have an email, and instead has
    // a user id, then we should lookup the user with the graph and get their
    // email.
    if (email) {
      message.to = email;
    } else {
      // Get the user to send the message to.
      const ctx = Context.forSystem();

      try {
        const { data, errors } = await ctx.graphql(
          `
              query GetUserEmail($user: ID!) {
                user(id: $user) {
                  email
                }
              }
          `,
          { user }
        );
        if (errors) {
          return done(errors);
        }
        const email = get(data, 'user.email');
        if (!email) {
          return done(errors.ErrMissingEmail);
        }

        message.to = email;
      } catch (err) {
        return done(err);
      }
    }

    // Actually send the email.
    mailer.transport.sendMail(message, err => {
      if (err) {
        debug(`Failed to send mail for Job[${id}]:`, err);
        return done(err);
      }

      debug(`Finished sending mail for Job[${id}]`);
      return done();
    });
  });
};
