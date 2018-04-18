const { get } = require('lodash');
const moment = require('moment');
const uuid = require('uuid/v4');
const { DOWNLOAD_LINK_SUBJECT } = require('./constants');
const {
  ErrDeletionAlreadyScheduled,
  ErrDeletionNotScheduled,
} = require('./errors');
const { ErrNotAuthorized } = require('errors');

async function sendDownloadLink({
  user,
  loaders: { Settings },
  connectors: {
    errors,
    secrets,
    services: { Users, I18n, Limit },
    models: { User },
  },
}) {
  // downloadLinkLimiter can be used to limit downloads for the user's data to
  // once every 7 days.
  const downloadLinkLimiter = new Limit('profileDataDownloadLimiter', 1, '7d');

  // Check that the user has not already requested a download within the last
  // 7 days.
  const attempts = await downloadLinkLimiter.get(user.id);
  if (attempts && attempts >= 1) {
    throw errors.ErrMaxRateLimit;
  }

  // Check if the lastAccountDownload time is within 7 days.
  if (
    user.lastAccountDownload &&
    moment(user.lastAccountDownload)
      .add(7, 'days')
      .isAfter(moment())
  ) {
    throw errors.ErrMaxRateLimit;
  }

  // The account currently does not have a download link, let's record the
  // download. This will throw an error if a race ocurred and we should stop
  // now.
  await downloadLinkLimiter.test(user.id);

  // Generate a token for the download link.
  const token = await secrets.jwt.sign(
    { user: user.id },
    { jwtid: uuid.v4(), expiresIn: '1d', subject: DOWNLOAD_LINK_SUBJECT }
  );

  const now = new Date();

  const { organizationName } = await Settings.load('organizationName');

  // Send the download link via the user's attached email account.
  await Users.sendEmail(user, {
    template: 'download',
    locals: {
      token,
      organizationName,
      now,
    },
    subject: I18n.t('email.download.subject', organizationName),
  });

  // Amend the lastAccountDownload on the user.
  await User.update(
    { id: user.id },
    { $set: { 'metadata.lastAccountDownload': now } }
  );
}

// requestDeletion will schedule the current user to have their account deleted
// by setting the `scheduledDeletionDate` on the user 12 hours from now.
async function requestDeletion({ user, connectors: { models: { User } } }) {
  // Ensure the user doesn't already have a deletion scheduled.
  if (get(user, 'metadata.scheduledDeletionDate')) {
    throw new ErrDeletionAlreadyScheduled();
  }

  // Get the date in the future 12 hours from now.
  const scheduledDeletionDate = moment()
    .add(12, 'hours')
    .toDate();

  // Amend the scheduledDeletionDate on the user.
  await User.update(
    { id: user.id },
    { $set: { 'metadata.scheduledDeletionDate': scheduledDeletionDate } }
  );

  return scheduledDeletionDate;
}

// cancelDeletion will unset the scheduled deletion date on the user account
// that is used to indicate that the user was scheduled for deletion.
async function cancelDeletion({ user, connectors: { models: { User } } }) {
  // Ensure the user has a deletion scheduled.
  if (!get(user, 'metadata.scheduledDeletionDate', null)) {
    throw new ErrDeletionNotScheduled();
  }

  // Amend the scheduledDeletionDate on the user.
  await User.update(
    { id: user.id },
    { $unset: { 'metadata.scheduledDeletionDate': 1 } }
  );
}

module.exports = ctx =>
  ctx.user
    ? {
        User: {
          requestDownloadLink: () => sendDownloadLink(ctx),
          requestDeletion: () => requestDeletion(ctx),
          cancelDeletion: () => cancelDeletion(ctx),
        },
      }
    : {
        User: {
          requestDownloadLink: () => Promise.reject(new ErrNotAuthorized()),
          requestDeletion: () => Promise.reject(new ErrNotAuthorized()),
          cancelDeletion: () => Promise.reject(new ErrNotAuthorized()),
        },
      };
