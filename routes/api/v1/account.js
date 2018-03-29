const express = require('express');
const router = express.Router();
const UsersService = require('../../../services/users');
const mailer = require('../../../services/mailer');
const authorization = require('../../../middleware/authorization');
const errors = require('../../../errors');
const archiver = require('archiver');
const stringify = require('csv-stringify');
const moment = require('moment');
const { pick, get, kebabCase } = require('lodash');

// Return the current logged in user.
router.get('/', authorization.needed(), (req, res, next) => {
  res.json(req.user);
});

/**
 * verifyTokenOnCheck will verify that the request contains a token, and if
 * being checked, will return the check status to the user.
 *
 * @param {Function} verifier the function used to verify the token, will throw on error
 * @param {Object} error the error object to send back in the event an error is found
 */
const tokenCheck = (verifier, error, ...whitelistedErrors) => async (
  req,
  res,
  next
) => {
  const { token = null, check = false } = req.body;

  if (check) {
    // This request is checking to see if the token is valid.
    try {
      // Verify the token.
      await verifier(token);
    } catch (err) {
      if (whitelistedErrors.includes(err)) {
        return next(err);
      }

      // Log out the error, slurp it and send out the predefined error to the
      // error handler.
      console.error(err);
      return next(error);
    }

    res.status(204).end();

    // Don't continue to pass it onto the next middleware, as we've only been
    // asked to verify the token.
    return;
  }

  next();
};

// Takes the password confirmation token available as a payload parameter and if
// it verifies, it updates the confirmed_at date on the local profile.
router.post(
  '/email/verify',
  tokenCheck(
    UsersService.verifyEmailConfirmationToken,
    errors.ErrEmailVerificationToken,
    errors.ErrEmailAlreadyVerified
  ),
  async (req, res, next) => {
    const { token } = req.body;

    try {
      let { referer } = await UsersService.verifyEmailConfirmation(token);
      return res.json({ redirectUri: referer });
    } catch (err) {
      console.error(err);
      return next(errors.ErrEmailVerificationToken);
    }
  }
);

// Sends the password reset email if the user exists.
router.post('/password/reset', async (req, res, next) => {
  const { email, loc } = req.body;

  if (!email) {
    return next(errors.ErrMissingEmail);
  }

  try {
    let token = await UsersService.createPasswordResetToken(email, loc);
    if (token) {
      await mailer.send({
        template: 'password-reset',
        locals: {
          token,
        },
        subject: 'Password Reset',
        email,
      });
    }

    res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

// Executes the password reset.
router.put(
  '/password/reset',
  tokenCheck(
    UsersService.verifyPasswordResetToken,
    errors.ErrPasswordResetToken
  ),
  async (req, res, next) => {
    const { token, password } = req.body;

    if (!password || password.length < 8) {
      return next(errors.ErrPasswordTooShort);
    }

    try {
      let [user, redirect] = await UsersService.verifyPasswordResetToken(token);

      // Change the users' password.
      await UsersService.changePassword(user.id, password);

      res.json({ redirect });
    } catch (e) {
      console.error(e);
      return next(errors.ErrNotAuthorized);
    }
  }
);

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
      comment.asset.url,
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

// /download will send back a zipped archive of the users account.
router.post(
  '/download',
  express.urlencoded({ extended: false }),
  tokenCheck(UsersService.verifyDownloadToken, new Error('invalid token')),
  async (req, res, next) => {
    try {
      const { token } = req.body;

      // Pull the userID and the date that the token was issued out of the
      // provided token.
      const { user: userID, iat } = await UsersService.verifyDownloadToken(
        token
      );

      // Unpack the date that the token was issued, and use it as a source for the
      // earliest comment we should include in the download.
      const latestContentDate = new Date(iat * 1000);

      // Grab the user that we're generating the export from. We'll use it to
      // create a new context.
      const user = await UsersService.findById(userID);

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

module.exports = router;
