const { TalkError } = require('errors');

// ErrNoLocalProfile is returned when there is no existing local profile
// attached to a user.
class ErrNoLocalProfile extends TalkError {
  constructor() {
    super('No local profile associated with account', {
      translation_key: 'NO_LOCAL_PROFILE',
      status: 400,
    });
  }
}

// ErrLocalProfile is returned when a profile is already attached to a user and
// the user is trying to attach a new profile to it.
class ErrLocalProfile extends TalkError {
  constructor() {
    super('Local profile already associated with account', {
      translation_key: 'LOCAL_PROFILE',
      status: 400,
    });
  }
}

// ErrIncorrectPassword is returned when the password passed was incorrect.
class ErrIncorrectPassword extends TalkError {
  constructor() {
    super('Password was incorrect', {
      translation_key: 'INCORRECT_PASSWORD',
      status: 400,
    });
  }
}

module.exports = { ErrLocalProfile, ErrNoLocalProfile, ErrIncorrectPassword };
