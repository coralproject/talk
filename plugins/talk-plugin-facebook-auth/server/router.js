module.exports = router => {
  /**
   * Facebook auth endpoint, this will redirect the user immediately to facebook
   * for authorization.
   */
  router.get('/api/v1/auth/facebook', (req, res, next) => {
    const { connectors: { services: { Passport } } } = req.context;

    return Passport.authenticate('facebook', {
      display: 'popup',
      authType: 'rerequest',
      scope: ['public_profile'],
    })(req, res, next);
  });

  /**
   * Facebook callback endpoint, this will send the user a html page designed to
   * send back the user credentials upon successful login.
   */
  router.get('/api/v1/auth/facebook/callback', (req, res, next) => {
    const { connectors: { services: { Passport } } } = req.context;
    const { HandleAuthPopupCallback } = Passport;

    // Perform the facebook login flow and pass the data back through the opener.
    Passport.authenticate(
      'facebook',
      { session: false },
      HandleAuthPopupCallback(req, res, next)
    )(req, res, next);
  });
};
