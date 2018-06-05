const { get } = require('lodash');
const moment = require('moment');
const uuid = require('uuid/v4');
const { DOWNLOAD_LINK_SUBJECT } = require('./constants');
const {
  ErrDeletionAlreadyScheduled,
  ErrDeletionNotScheduled,
} = require('./errors');
const { ErrNotAuthorized, ErrMaxRateLimit } = require('errors');
const { URL } = require('url');
const {
  scheduledDeletionDelayHours,
  downloadRateLimitDays,
} = require('../config');

// generateDownloadLinks will generate a signed set of links for a given user to
// download an archive of their data.
async function generateDownloadLinks(ctx, userID) {
  const {
    connectors: {
      url: { BASE_URL },
      secrets,
    },
  } = ctx;

  // Generate a token for the download link.
  const token = await secrets.jwt.sign(
    { user: userID },
    { jwtid: uuid.v4(), expiresIn: '1d', subject: DOWNLOAD_LINK_SUBJECT }
  );

  // Generate the url that a user can land on.
  const downloadLandingURL = new URL('account/download', BASE_URL);
  downloadLandingURL.hash = token;

  // Generate the url that the API calls to download the actual zip.
  const downloadFileURL = new URL('api/v1/account/download', BASE_URL);
  downloadFileURL.searchParams.set('token', token);

  return {
    downloadLandingURL: downloadLandingURL.href,
    downloadFileURL: downloadFileURL.href,
  };
}

async function sendDownloadLink(ctx) {
  const {
    user,
    loaders: { Settings },
    connectors: {
      services: { Users, I18n, Limit },
      models: { User },
    },
  } = ctx;

  // downloadLinkLimiter can be used to limit downloads for the user's data to
  // once every ${downloadRateLimitDays} days.
  const downloadLinkLimiter = new Limit(
    'profileDataDownloadLimiter',
    1,
    `${downloadRateLimitDays}d`
  );

  // Check that the user has not already requested a download within the last
  // ${downloadRateLimitDays} days.
  const attempts = await downloadLinkLimiter.get(user.id);
  if (attempts && attempts >= 1) {
    throw new ErrMaxRateLimit();
  }

  // Check if the lastAccountDownload time is within ${downloadRateLimitDays}
  // days.
  if (
    user.lastAccountDownload &&
    moment(user.lastAccountDownload)
      .add(downloadRateLimitDays, 'days')
      .isAfter(moment())
  ) {
    throw new ErrMaxRateLimit();
  }

  // The account currently does not have a download link, let's record the
  // download. This will throw an error if a race ocurred and we should stop
  // now.
  await downloadLinkLimiter.test(user.id);

  const now = new Date();

  // Generate the download links.
  const { downloadLandingURL } = await generateDownloadLinks(ctx, user.id);

  const { organizationName } = await Settings.select('organizationName');

  // Send the download link via the user's attached email account.
  await Users.sendEmail(user, {
    template: 'download',
    locals: {
      downloadLandingURL,
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
// by setting the `scheduledDeletionDate` on the user
// ${scheduledDeletionDelayHours} hours from now.
async function requestDeletion({
  user,
  loaders: { Settings },
  connectors: {
    models: { User },
    services: { Users, I18n },
  },
}) {
  // Ensure the user doesn't already have a deletion scheduled.
  if (get(user, 'metadata.scheduledDeletionDate')) {
    throw new ErrDeletionAlreadyScheduled();
  }

  // Get the date in the future ${scheduledDeletionDelayHours} hours from now.
  const scheduledDeletionDate = moment().add(
    scheduledDeletionDelayHours,
    'hours'
  );

  // Amend the scheduledDeletionDate on the user.
  await User.update(
    { id: user.id },
    {
      $set: {
        'metadata.scheduledDeletionDate': scheduledDeletionDate.toDate(),
      },
    }
  );

  const { organizationName } = await Settings.select('organizationName');

  // Send the download link via the user's attached email account.
  await Users.sendEmail(user, {
    template: 'plain',
    locals: {
      body: I18n.t(
        'email.delete.body',
        organizationName,
        scheduledDeletionDate.format('MMM Do YYYY, h:mm:ss a')
      ),
    },
    subject: I18n.t('email.delete.subject', organizationName),
  });

  return scheduledDeletionDate.toDate();
}

// cancelDeletion will unset the scheduled deletion date on the user account
// that is used to indicate that the user was scheduled for deletion.
async function cancelDeletion({
  user,
  loaders: { Settings },
  connectors: {
    models: { User },
    services: { I18n, Users },
  },
}) {
  // Ensure the user has a deletion scheduled.
  const scheduledDeletionDate = get(
    user,
    'metadata.scheduledDeletionDate',
    null
  );
  if (!scheduledDeletionDate) {
    throw new ErrDeletionNotScheduled();
  }

  // Amend the scheduledDeletionDate on the user.
  await User.update(
    { id: user.id },
    { $unset: { 'metadata.scheduledDeletionDate': 1 } }
  );

  const { organizationName } = await Settings.select('organizationName');

  // Send the download link via the user's attached email account.
  await Users.sendEmail(user, {
    template: 'plain',
    locals: {
      body: I18n.t(
        'email.cancelDelete.body',
        organizationName,
        moment(scheduledDeletionDate).format('MMM Do YYYY, h:mm:ss a')
      ),
    },
    subject: I18n.t('email.cancelDelete.subject', organizationName),
  });
}

// downloadUser will return the download file url that can be used to directly
// download the archive.
async function downloadUser(ctx, userID) {
  if (ctx.user.role !== 'ADMIN') {
    throw new ErrNotAuthorized();
  }

  const { downloadFileURL } = await generateDownloadLinks(ctx, userID);
  return downloadFileURL;
}

module.exports = ctx =>
  ctx.user
    ? {
        User: {
          requestDownloadLink: () => sendDownloadLink(ctx),
          requestDeletion: () => requestDeletion(ctx),
          cancelDeletion: () => cancelDeletion(ctx),
          download: userID => downloadUser(ctx, userID),
        },
      }
    : {
        User: {
          requestDownloadLink: () => Promise.reject(new ErrNotAuthorized()),
          requestDeletion: () => Promise.reject(new ErrNotAuthorized()),
          cancelDeletion: () => Promise.reject(new ErrNotAuthorized()),
          download: () => Promise.reject(new ErrNotAuthorized()),
        },
      };
