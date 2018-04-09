const path = require('path');
const express = require('express');
const { DOWNLOAD_LINK_SUBJECT } = require('./constants');
const { get, pick, kebabCase } = require('lodash');
const moment = require('moment');
const archiver = require('archiver');
const stringify = require('csv-stringify');

async function verifyDownloadToken(
  { connectors: { services: { Users } } },
  token
) {
  const jwt = await Users.verifyToken(token, {
    subject: DOWNLOAD_LINK_SUBJECT,
  });

  return jwt;
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

module.exports = router => {
  // /account/download will render the download page.
  router.get('/account/download', (req, res) => {
    res.render(path.join(__dirname, 'views', 'download'));
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
