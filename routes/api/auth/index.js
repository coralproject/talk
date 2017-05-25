const express = require('express');
const {passport, HandleGenerateCredentials, HandleLogout} = require('../../../services/passport');

const router = express.Router();

const lookup = (i) => {
  switch (i) {
  case 0: return 'header';
  case 1: return 'cookie';
  case 2: return 'query';
  }
};

/**
 * This returns the user if they are logged in.
 */
router.get('/', (req, res, next) => {

  if (req.user) {
    return next();
  }

  res.status(204).end();
}, (req, res) => {

  const authorizations = [
    req.headers.authorization,
    req.cookies ? req.cookies.authorization : [],
    req.query.authorization
  ];

  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');

  let i = authorizations.findIndex((source) => source !== null && typeof source != 'undefined' && source.length > 0);
  if (i >= 0) {
    let authorization = authorizations[i];
    let source = lookup(i);

    // Send back the user object.
    res.json({authorization, source, user: req.user});
  }
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
  passport.authenticate('local', {session: false}, HandleGenerateCredentials(req, res, next))(req, res, next);
});

module.exports = router;
