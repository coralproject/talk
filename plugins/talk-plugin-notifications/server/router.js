const path = require('path');
const { UNSUBSCRIBE_SUBJECT } = require('./config');
const { get, isEmpty, reduce } = require('lodash');

module.exports = router => {
  router.get('/account/unsubscribe-notifications', (req, res) => {
    res.render(path.join(__dirname, 'views/unsubscribe-notifications.njk'));
  });

  /**
   * Verifies that the token is valid.
   */
  const verifyToken = (req, res, next) => {
    const {
      connectors: {
        secrets: { jwt },
        config: { JWT_ISSUER, JWT_AUDIENCE },
      },
    } = req.context;
    const { token: tokenString = '' } = req.body;
    if (!tokenString) {
      return res.status(400).end();
    }

    jwt.verify(
      tokenString,
      {
        issuer: JWT_ISSUER,
        subject: UNSUBSCRIBE_SUBJECT,
        audience: JWT_AUDIENCE,
      },
      (err, token) => {
        if (err) {
          return res.status(400).end();
        }

        req.token = token;
        next();
      }
    );
  };

  // Verifies that a token is valid.
  router.post(
    '/api/v1/account/unsubscribe-notifications/verify',
    verifyToken,
    (req, res) => {
      res.status(204).end();
    }
  );

  router.post(
    '/api/v1/account/unsubscribe-notifications',
    verifyToken,
    async (req, res, next) => {
      const {
        connectors: {
          models: { User },
        },
      } = req.context;
      const { user: userID } = req.token;

      try {
        const user = await User.findOne({ id: userID });
        if (!user) {
          return res.status(400).end();
        }

        // Get the notification settings.
        const settings = get(user, 'metadata.notifications.settings', {});

        // If they have no notification settings set to true, then we're done.
        if (isEmpty(settings)) {
          return res.status(204).end();
        }

        const update = reduce(
          settings,
          (updates, value, key) => {
            if (value) {
              updates[`metadata.notifications.settings.${key}`] = false;
            }

            return updates;
          },
          {}
        );

        if (isEmpty(update)) {
          return res.status(204).end();
        }

        // Save the user.
        await User.update({ id: userID }, { $set: update });

        res.status(204).end();
      } catch (err) {
        res.status(400).end();
      }
    }
  );
};
