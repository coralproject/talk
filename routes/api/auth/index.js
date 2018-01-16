const express = require('express');
const {
  passport,
  HandleGenerateCredentials,
  HandleLogout,
} = require('../../../services/passport');

const router = express.Router();

/**
 * This returns the user if they are logged in.
 */
router.get('/', (req, res, next) => {
  if (!req.user) {
    res.status(204).end();
    return;
  }

  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  // Send back the user object.
  res.json({ user: req.user });
});

/**
 * This blacklists the token used to authenticate.
 */

router.delete('/', HandleLogout);

// =============================================================================
// PASSPORT ROUTES
//==============================================================================

/**
 * Local auth endpoint, will recieve a email and password
 */
router.post('/local', (req, res, next) => {
  // Perform the local authentication.
  passport.authenticate(
    'local',
    { session: false },
    HandleGenerateCredentials(req, res, next)
  )(req, res, next);
});

module.exports = router;
