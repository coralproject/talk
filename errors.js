// ErrPasswordTooShort is returned when the password length is too short.
const ErrPasswordTooShort = new Error('password must be at least 8 characters');
ErrPasswordTooShort.translation_key = 'PASSWORD_LENGTH';
ErrPasswordTooShort.status = 400;

const ErrMissingEmail = new Error('email is required');
ErrMissingEmail.translation_key = 'EMAIL_REQUIRED';
ErrMissingEmail.status = 400;

const ErrMissingPassword = new Error('password is required');
ErrMissingPassword.translation_key = 'PASSWORD_REQUIRED';
ErrMissingPassword.status = 400;

const ErrEmailTaken = new Error('Email address already in use');
ErrEmailTaken.translation_key = 'EMAIL_IN_USE';
ErrEmailTaken.status = 400;

const ErrSpecialChars = new Error('No special characters are allowed in a display name');
ErrSpecialChars.translation_key = 'NO_SPECIAL_CHARACTERS';
ErrSpecialChars.status = 400;

const ErrMissingDisplay = new Error('A display name is required to create a user');
ErrMissingDisplay.translation_key = 'DISPLAY_NAME_REQUIRED';
ErrMissingDisplay.status = 400;

// ErrContainsProfanity is returned in the event that the middleware detects
// profanity/wordlisted words in the payload.
const ErrContainsProfanity = new Error('Suspected profanity. If you think this in error, please let us know!');
ErrContainsProfanity.translation_key = 'PROFANITY_ERROR';
ErrContainsProfanity.status = 400;

module.exports = {
  ErrPasswordTooShort,
  ErrMissingEmail,
  ErrMissingPassword,
  ErrEmailTaken,
  ErrSpecialChars,
  ErrMissingDisplay,
  ErrContainsProfanity
};
