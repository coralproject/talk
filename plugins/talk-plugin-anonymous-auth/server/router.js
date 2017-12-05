const UsersService = require('services/users');

module.exports = (router) => {

  const {passport, HandleGenerateCredentialsAnonymous} = require('services/passport');

  // create an anonymous user.
  router.get('/api/v1/auth/anonymous', (req, res, next) => {
    UsersService.createAnonymousUser(req.ip)
      .then(user => {
        passport.authenticate('local', {session: false}, HandleGenerateCredentialsAnonymous(user, req, res, next))(req, res, next);
      })
      .catch(next);
  });
};
