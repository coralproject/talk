module.exports = router => {
  const { passport, HandleAuthPopupCallback } = require('services/passport');

  /**
   * Facebook auth endpoint, this will redirect the user immediatly to facebook
   * for authorization.
   */
  router.get(
    '/api/v1/auth/facebook',
    passport.authenticate('facebook', {
      display: 'popup',
      authType: 'rerequest',
      scope: ['public_profile'],
    })
  );

  /**
   * Facebook callback endpoint, this will send the user a html page designed to
   * send back the user credentials upon sucesfull login.
   */
  router.get('/api/v1/auth/facebook/callback', (req, res, next) => {
    // Perform the facebook login flow and pass the data back through the opener.
    passport.authenticate(
      'facebook',
      { session: false },
      HandleAuthPopupCallback(req, res, next)
    )(req, res, next);
  });
};
