const { ErrNotAuthorized, ErrNotFound, ErrEmailTaken } = require('errors');
const {
  ErrNoLocalProfile,
  ErrLocalProfile,
  ErrIncorrectPassword,
} = require('./errors');
const { get } = require('lodash');

// hasLocalProfile checks a user's profiles to see if they already have a local
// profile associated with their account.
const hasLocalProfile = user =>
  get(user, 'profiles', []).some(({ provider }) => provider === 'local');

// updateUserEmailAddress will verify that the user has sent the correct
// password followed by executing the email change and notifying the emails
// about that change.
async function updateUserEmailAddress(ctx, email, confirmPassword) {
  const {
    user,
    loaders: { Settings },
    connectors: {
      models: { User },
      services: {
        Mailer,
        I18n,
        Users,
        Utils: { getRedirectUri },
      },
    },
  } = ctx;

  // Ensure that the user has a local profile associated with their account.
  if (!hasLocalProfile(user)) {
    throw new ErrNoLocalProfile();
  }

  // Ensure that the password provided matches what we have on file.
  if (!(await user.verifyPassword(confirmPassword))) {
    throw new ErrIncorrectPassword();
  }

  // Cleanup the email address.
  email = email.toLowerCase().trim();

  // Update the Users email address.
  try {
    await User.update(
      {
        id: user.id,
        profiles: { $elemMatch: { provider: 'local' } },
      },
      {
        $set: { 'profiles.$.id': email },
        $unset: { 'profiles.$.metadata.confirmed_at': 1 },
      }
    );
  } catch (err) {
    if (err.code === 11000) {
      throw new ErrEmailTaken();
    }

    throw err;
  }

  // Get some context for the email to be sent.
  const { organizationContactEmail } = await Settings.select(
    'organizationContactEmail'
  );

  // Send off the email to the old email address that we have changed it.
  await Mailer.send({
    email: user.firstEmail,
    template: 'plain',
    locals: {
      body: I18n.t(
        'email.email_change_original.body',
        user.firstEmail,
        email,
        organizationContactEmail
      ),
    },
    subject: I18n.t('email.email_change_original.subject'),
  });

  // Try to get the root parent, and their redirect uri.
  const redirectUri = getRedirectUri(ctx.rootParent);

  // Send off the email to the new email address that we need to verify the new
  // address.
  await Users.sendEmailConfirmation(user, email, redirectUri);
}

// attachUserLocalAuth will attach a new local profile to an existing user.
async function attachUserLocalAuth(ctx, email, password) {
  const {
    user,
    connectors: {
      models: { User },
      services: {
        Users,
        Utils: { getRedirectUri },
      },
    },
  } = ctx;

  // Ensure that the current user doesn't already have a local account
  // associated with them.
  if (hasLocalProfile(user)) {
    throw new ErrLocalProfile();
  }

  // Cleanup the email address.
  email = email.toLowerCase().trim();

  // Validate the password.
  await Users.isValidPassword(password);

  // Hash the new password.
  const hashedPassword = await Users.hashPassword(password);

  try {
    // Associate the account with the user.
    const updatedUser = await User.findOneAndUpdate(
      {
        id: user.id,
        'profiles.provider': { $ne: 'local' },
      },
      {
        $push: {
          profiles: {
            provider: 'local',
            id: email,
          },
        },
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      const foundUser = await User.findOne({ id: user.id });
      if (!foundUser) {
        throw new ErrNotFound();
      }

      // Check to see if this was the result of a race.
      if (hasLocalProfile(foundUser)) {
        throw new ErrLocalProfile();
      }

      throw new Error('local auth attachment failed due to unexpected reason');
    }

    // Try to get the root parent, and their redirect uri.
    const redirectUri = getRedirectUri(ctx.rootParent);

    // Send off the email to the new email address that we need to verify the
    // new address.
    await Users.sendEmailConfirmation(updatedUser, email, redirectUri);
  } catch (err) {
    if (err.code === 11000) {
      throw new ErrEmailTaken();
    }
    throw err;
  }
}

module.exports = ctx => {
  const mutators = {
    User: {
      updateEmailAddress: () => Promise.reject(new ErrNotAuthorized()),
      attachLocalAuth: () => Promise.reject(new ErrNotAuthorized()),
    },
  };

  if (ctx.user) {
    mutators.User.updateEmailAddress = ({ email, confirmPassword }) =>
      updateUserEmailAddress(ctx, email, confirmPassword);

    mutators.User.attachLocalAuth = ({ email, password }) =>
      attachUserLocalAuth(ctx, email, password);
  }

  return mutators;
};
