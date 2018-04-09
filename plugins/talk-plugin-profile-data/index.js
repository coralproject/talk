const express = require('express');
const path = require('path');
const { get, pick, kebabCase } = require('lodash');
const moment = require('moment');
const uuid = require('uuid/v4');
const archiver = require('archiver');
const stringify = require('csv-stringify');

const DOWNLOAD_LINK_SUBJECT = 'download_link';

async function verifyDownloadToken(
  { connectors: { services: { Users } } },
  token
) {
  const jwt = await Users.verifyToken(token, {
    subject: DOWNLOAD_LINK_SUBJECT,
  });

  return jwt;
}

async function sendDownloadLink({
  user,
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

  // Send the download link via the user's attached email account.
  await Users.sendEmail(user, {
    template: 'download',
    locals: {
      token,
    },
    subject: I18n.t('email.download.subject'),
  });

  // Amend the lastAccountDownload on the user.
  await User.update(
    { id: user.id },
    { $set: { 'metadata.lastAccountDownload': new Date() } }
  );
}

// loadCommentsBatch will load a batch of the comments and write them to the
// stream.
async function loadCommentsBatch(ctx, csv, variables = {}) {
  let result = await ctx.graphql(
    `
    query GetMyComments($cursor: Cursor) {
      me {
        comments(query: {
          limit: 100,
          cursor: $cursor
        }) {
          hasNextPage
          endCursor
          nodes {
            id
            created_at
            asset {
              url
            }
            body
            url
          }
        }
      }
    }
  `,
    variables
  );
  if (result.errors) {
    throw result.errors;
  }

  for (const comment of get(result, 'data.me.comments.nodes', [])) {
    csv.write([
      comment.id,
      moment(comment.created_at).format('YYYY-MM-DD HH:mm:ss'),
      get(comment, 'asset.url'),
      comment.url,
      comment.body,
    ]);
  }

  return pick(result.data.me.comments, ['hasNextPage', 'endCursor']);
}

// loadComments will load batches of the comments and write them to the csv
// stream. Once the comments have finished writing, it will close the stream.
async function loadComments(ctx, archive, latestContentDate) {
  // Create all the csv writers that'll write the data to the archive.
  const csv = stringify();

  // Add all the streams as files to the archive.
  archive.append(csv, { name: 'talk-export/my_comments.csv' });

  csv.write(['ID', 'Timestamp', 'Article', 'Link', 'Body']);

  // Load the first batch's comments from the latest date that we were provided
  // from the token.
  let connection = await loadCommentsBatch(ctx, csv, {
    cursor: latestContentDate,
  });

  // As long as there's more comments, keep paginating.
  while (connection.hasNextPage) {
    connection = await loadCommentsBatch(ctx, csv, {
      cursor: connection.endCursor,
    });
  }

  csv.end();
}

const router = router => {
  // /account/download will render the download page.
  router.get('/account/download', (req, res) => {
    res.render(path.join(__dirname, 'server/views/download'));
  });

  // /api/v1/account/download will send back a zipped archive of the users
  // account.
  router.post(
    '/api/v1/account/download',
    express.urlencoded({ extended: false }),
    async (req, res, next) => {
      const { token = null, check = false } = req.body;

      if (check) {
        // This request is checking to see if the token is valid.
        try {
          // Verify the token
          await verifyDownloadToken(req.context, token);
        } catch (err) {
          // Log out the error, slurp it and send out the predefined error to the
          // error handler.
          console.error(err);
          return next(new Error('invalid token'));
        }

        res.status(204).end();

        // Don't continue to pass it onto the next middleware, as we've only been
        // asked to verify the token.
        return;
      }

      const { connectors: { services: { Users } } } = req.context;

      try {
        // Pull the userID and the date that the token was issued out of the
        // provided token.
        const { user: userID, iat } = await verifyDownloadToken(
          req.context,
          token
        );

        // Unpack the date that the token was issued, and use it as a source for the
        // earliest comment we should include in the download.
        const latestContentDate = new Date(iat * 1000);

        // Grab the user that we're generating the export from. We'll use it to
        // create a new context.
        const user = await Users.findById(userID);

        // Base a new context off of the new user.
        const ctx = req.context.masqueradeAs(user);

        // Get the current user's username. We need it for the generated filenames.
        const result = await ctx.graphql('{ me { username } }');
        if (result.errors) {
          throw result.errors;
        }
        const username = get(result, 'data.me.username');

        // Generate the filename of the file that the user will download.
        const filename = `talk-${kebabCase(username)}-${kebabCase(
          moment(latestContentDate).format('YYYY-MM-DD HH:mm:ss')
        )}.zip`;

        res.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${filename}`,
        });

        // Create the zip archive we'll use to write all the exported files to.
        const archive = archiver('zip', {
          zlib: { level: 9 },
        });

        // Pipe this to the response writer directly.
        archive.pipe(res);

        // Load the comments csv up with the user's comments.
        await loadComments(ctx, archive, latestContentDate);

        // Mark the end of adding files, no more files can be added after this. Once
        // all the stream readers have finished writing, and have closed, the
        // archiver will close which will finish the HTTP request.
        archive.finalize();
      } catch (err) {
        return next(err);
      }
    }
  );
};

const typeDefs = `
  type User {

    # lastAccountDownload is the date that the user last requested a comment
    # download.
    lastAccountDownload: Date
  }

  type RequestDownloadLinkResponse implements Response {

    # An array of errors relating to the mutation that occurred.
    errors: [UserError!]
  }

  type RootMutation {

    # requestDownloadLink will request a download link be sent to the primary
    # users email address.
    requestDownloadLink: RequestDownloadLinkResponse
  }
`;

const connect = connectors => {
  const { services: { Mailer } } = connectors;

  // Setup the mail templates.
  ['txt', 'html'].forEach(format => {
    Mailer.templates.register(
      path.join(__dirname, 'server', 'emails', `download.${format}.ejs`),
      'download',
      format
    );
  });
};

module.exports = {
  mutators: ctx => ({
    User: {
      requestDownloadLink: () => sendDownloadLink(ctx),
    },
  }),
  router,
  connect,
  typeDefs,
  translations: path.join(__dirname, 'translations.yml'),
  resolvers: {
    RootMutation: {
      requestDownloadLink: async (_, args, { mutators: { User } }) => {
        await User.requestDownloadLink();
      },
    },
    User: {
      lastAccountDownload: (user, args, { user: currentUser }) => {
        // If the current user is not the requesting user, and the user is not
        // an admin, return nothing.
        if (user.id !== currentUser.id && user.role !== 'ADMIN') {
          return null;
        }

        return get(user, 'metadata.lastAccountDownload', null);
      },
    },
  },
};
