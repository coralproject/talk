module.exports = router => {
  const { passport, HandleAuthPopupCallback } = require('services/passport');

  /**
<<<<<<< HEAD
   * Google auth endpoint, this will redirect the user immediately to Google
=======
   * Google auth endpoint, this will redirect the user immediately to google
>>>>>>> da56cd5b18bfb7bb0e9f1ae2dba1f4c729f41ff1
   * for authorization.
   */
  router.get(
    '/api/v1/auth/google',
    passport.authenticate('google', {
      display: 'popup',
      authType: 'rerequest',
      scope: ['profile'],
    })
  );

  /**
   * Google callback endpoint, this will send the user a html page designed to
<<<<<<< HEAD
   * send back the user credentials upon successful login.
=======
   * send back the user credentials upon sucessful login.
>>>>>>> da56cd5b18bfb7bb0e9f1ae2dba1f4c729f41ff1
   */
  router.get('/api/v1/auth/google/callback', (req, res, next) => {
    // Perform the Google login flow and pass the data back through the opener.
    passport.authenticate(
      'google',
      { session: false },
      HandleAuthPopupCallback(req, res, next)
    )(req, res, next);
  });
};
