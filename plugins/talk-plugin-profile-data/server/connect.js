const path = require('path');
const moment = require('moment');
const { CronJob } = require('cron');
const { get } = require('lodash');
const { ErrMissingEmail } = require('errors');

module.exports = connectors => {
  const {
    services: { Mailer, I18n },
    models: { User },
    graph: { Context },
  } = connectors;

  // Setup the mail templates.
  ['txt', 'html'].forEach(format => {
    Mailer.templates.register(
      path.join(__dirname, 'emails', `download.${format}.ejs`),
      'download',
      format
    );
  });

  // Setup the cron job that will scan for accounts to delete every 30 minutes.
  new CronJob({
    cronTime: '0,30 * * * *',
    timeZone: 'America/New_York',
    start: true,
    runOnInit: true,
    onTick: async () => {
      // Create the context we'll use to perform user deletions.
      const ctx = Context.forSystem();

      try {
        // Grab some settings.
        const {
          loaders: { Settings },
        } = ctx;
        const {
          organizationName,
          organizationContactEmail,
        } = await Settings.select(
          'organizationName',
          'organizationContactEmail'
        );

        // rescheduledDeletionDate is the date in the future that we'll set the
        // user's account to be deleted on if this delete fails.
        const rescheduledDeletionDate = moment()
          .add(1, 'hours')
          .toDate();

        // Keep running for each user we can pull.
        while (true) {
          // We'll find any user that has an account deletion date before now
          // and update the user such that their deletion time is 1 hour from
          // now. This will ensure that only one instance can pull the same
          // user at a time, and if the delete fails, it will be retried an
          // hour from now. If the deletion was successful, well, it can't be
          // retried because the reference to the scheduledDeletionDate will
          // get deleted along with the user.
          const user = await User.findOneAndUpdate(
            {
              'metadata.scheduledDeletionDate': { $lte: new Date() },
            },
            {
              $set: {
                'metadata.scheduledDeletionDate': rescheduledDeletionDate,
              },
            }
          );
          if (!user) {
            // There are no more users that meet the search criteria! We're
            // done!
            ctx.log.info('no more users are scheduled for deletion');
            break;
          }

          // Get the user's email address.
          const reply = await ctx.graphql(
            `
            query GetUserEmailAddress($user_id: ID!) {
              user(id: $user_id) {
                email
              }
            }
            `,
            { user_id: user.id }
          );
          if (reply.errors) {
            throw reply.errors;
          }

          const email = get(reply, 'data.user.email');
          if (!email) {
            throw new ErrMissingEmail();
          }

          ctx.log.info(
            {
              userID: user.id,
              scheduledDeletionDate: user.metadata.scheduledDeletionDate,
            },
            'starting user delete'
          );

          // Delete the user using the existing graph call.
          const { data, errors } = await ctx.graphql(
            `
            mutation DeleteUser($user_id: ID!) {
              delUser(id: $user_id) {
                errors {
                  translation_key
                }
              }
            }
          `,
            { user_id: user.id }
          );
          if (errors) {
            throw errors;
          }

          if (data.errors) {
            throw data.errors;
          }

          ctx.log.info({ userID: user.id }, 'user was deleted successfully');

          // Send the download link via the user's attached email account.
          await Mailer.send({
            template: 'plain',
            locals: {
              body: I18n.t(
                'email.deleted.body',
                organizationName,
                organizationContactEmail
              ),
            },
            subject: I18n.t('email.deleted.subject', organizationName),
            email,
          });
        }
      } catch (err) {
        ctx.log.error({ err }, 'could not handle user deletions');
      }
    },
  });
};
