const path = require('path');
const express = require('express');
const { DOWNLOAD_LINK_SUBJECT } = require('./constants');
const { get, pick, kebabCase } = require('lodash');
const moment = require('moment');
const archiver = require('archiver');
const stringify = require('csv-stringify');
const { ErrDownloadToken } = require('./errors');

async function verifyDownloadToken(
  {
    connectors: {
      services: { Users },
    },
  },
  token
) {
  const jwt = await Users.verifyToken(token, {
    subject: DOWNLOAD_LINK_SUBJECT,
  });

  return jwt;
}

// loadCommentsBatch will load a batch of the comments and write them to the
// stream.
async function loadCommentsBatch(ctx, csv, variables) {
  let result = await ctx.graphql(
    `
    query GetMyComments($userID: ID!, $cursor: Cursor) {
      user(id: $userID) {
        comments(query: {
          limit: 100,
          cursor: $cursor,
          statuses: null
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

  for (const comment of get(result, 'data.user.comments.nodes', [])) {
    csv.write([
      comment.id,
      moment(comment.created_at).format('YYYY-MM-DD HH:mm:ss'),
      get(comment, 'asset.url'),
      comment.url,
      comment.body,
    ]);
  }

  return pick(get(result, 'data.user.comments'), ['hasNextPage', 'endCursor']);
}

// loadComments will load batches of the comments and write them to the csv
// stream. Once the comments have finished writing, it will close the stream.
async function loadComments(ctx, userID, archive, latestContentDate) {
  // Create all the csv writers that'll write the data to the archive.
  const csv = stringify();

  // Add all the streams as files to the archive.
  archive.append(csv, { name: 'comments-export/my_comments.csv' });

  csv.write([
    'Comment ID',
    'Published Timestamp',
    'Article URL',
    'Comment Link',
    'Comment Text',
  ]);

  // Load the first batch's comments from the latest date that we were provided
  // from the token.
  let connection = await loadCommentsBatch(ctx, csv, {
    cursor: latestContentDate,
    userID,
  });

  // As long as there's more comments, keep paginating.
  while (connection.hasNextPage) {
    connection = await loadCommentsBatch(ctx, csv, {
      cursor: connection.endCursor,
      userID,
    });
  }

  csv.end();
}

module.exports = router => {
  // /account/download will render the download page.
  router.get('/account/download', (req, res) => {
    res.render(path.join(__dirname, 'views', 'download.njk'));
  });

  // /api/v1/account/download will send back a zipped archive of the users
  // account.
  router.all(
    '/api/v1/account/download',
    express.urlencoded({ extended: false }),
    async (req, res, next) => {
      let { token = null, check = false } = req.body;

      if (!token) {
        // If the token wasn't found in the body, then we should check the query
        // to see if it was passed that way.
        token = req.query.token;
      }

      if (!token) {
        return res.status(400).end();
      }

      if (check) {
        // This request is checking to see if the token is valid.
        try {
          // Verify the token
          await verifyDownloadToken(req.context, token);
        } catch (err) {
          return next(new ErrDownloadToken(err));
        }

        res.status(204).end();

        // Don't continue to pass it onto the next middleware, as we've only been
        // asked to verify the token.
        return;
      }

      const {
        connectors: {
          graph: { Context },
          errors,
        },
      } = req.context;

      try {
        // Pull the userID and the date that the token was issued out of the
        // provided token.
        const { user: userID, iat } = await verifyDownloadToken(
          req.context,
          token
        );

        // Create a system context used to get all comments for that user.
        const ctx = Context.forSystem();

        // Get the current user's username. We need it for the generated filenames.
        const result = await ctx.graphql(
          `query GetUser($userID: ID!) {
            user(id: $userID) { username }
          }`,
          { userID }
        );
        if (result.errors) {
          throw result.errors;
        }

        const user = get(result, 'data.user');
        if (!user) {
          throw new errors.ErrNotFound();
        }

        // Unpack the date that the token was issued, and use it as a source for the
        // earliest comment we should include in the download.
        const latestContentDate = new Date(iat * 1000);

        // Generate the filename of the file that the user will download.
        const username = get(user, 'username');
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
        await loadComments(ctx, userID, archive, latestContentDate);

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
