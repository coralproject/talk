// We need the UserModel because we need to update the user.
const UserModel = require('models/user');

// Get some middleware to use with the webhook.
const auth = require('middleware/authentication');
const authz = require('middleware/authorization');

// Load some config from the environment. This could be changed to a settings
// option later if you want to go that route.
const DEFAULT_AVATAR = process.env.DEFAULT_AVATAR;

module.exports = {

  // The new type definitions provides the new "avatar" field needed to inject
  // into the User type.
  typeDefs: `
    type User {
      avatar: String
    }
  `,

  // The User resolver will return the avatar from the embedded user metadata.
  resolvers: {
    User: {
      avatar(user) {
        if (user && user.metadata && user.metadata.avatar) {
          return user.metadata.avatar;
        }

        return DEFAULT_AVATAR;
      }
    }
  },

  // The custom router routes that we add here will allow an external system to
  // update the avatar when it changes on the remote system. Note that we do
  // use the auth/authz middleware, checking for the ADMIN role. This can be
  // used in conjunction with a personal access token generated from an ADMIN.
  router(router) {
    router.post('/webhooks/user_update', auth, authz.needed('ADMIN'), async (req, res, next) => {

      // We expect that the payload for the new avatar is in the following form:
      //
      // {
      //   "id": "123123-123123-12312313",
      //   "avatar": "https://great-cdn.cloudfront.net/best-photo.jpg"
      //   ...
      // }


      // Extract the data from the payload.
      let {
        id,
        avatar
      } = req.body;

      try {

        // Update the user model.
        await UserModel.update({id}, {
          $set: {
            'metadata.avatar': avatar
          }
        });

      } catch (e) {
        return next(e);
      }

      // Respond with a `202 Accepted` to indicate that we were able to process
      // the update.
      res.status(202).end()
    });
  }
};