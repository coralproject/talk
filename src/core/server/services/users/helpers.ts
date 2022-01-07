import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "coral-common/helpers/validate";
import {
  EmailExceedsMaxLengthError,
  EmailInvalidFormatError,
  PasswordTooShortError,
  UsernameContainsInvalidCharactersError,
  UsernameExceedsMaxLengthError,
  UsernameTooShortError,
} from "coral-server/errors";
import { User } from "coral-server/models/user";

/**
 * validateUsername will validate that the username is valid. Current
 * implementation uses a RegExp statically, future versions will expose this as
 * configuration.
 *
 * @param username the username to be tested
 */
export function validateUsername(username: string) {
  // TODO: replace these static regex/length with database options in the Tenant eventually

  if (!USERNAME_REGEX.test(username)) {
    throw new UsernameContainsInvalidCharactersError();
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    throw new UsernameExceedsMaxLengthError(
      username.length,
      USERNAME_MAX_LENGTH
    );
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    throw new UsernameTooShortError(username.length, USERNAME_MIN_LENGTH);
  }
}

/**
 * validatePassword will validate that the password is valid. Current
 * implementation uses a length statically, future versions will expose this as
 * configuration.
 *
 * @param password the password to be tested
 */
export function validatePassword(password: string) {
  // TODO: replace these static length with database options in the Tenant eventually
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new PasswordTooShortError(password.length, PASSWORD_MIN_LENGTH);
  }
}

const EMAIL_MAX_LENGTH = 100;

/**
 * validateEmail will validate that the email is valid. Current implementation
 * uses a length statically, future versions will expose this as configuration.
 *
 * @param email the email to be tested
 */
export function validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    throw new EmailInvalidFormatError();
  }

  // TODO: replace these static length with database options in the Tenant eventually
  if (email.length > EMAIL_MAX_LENGTH) {
    throw new EmailExceedsMaxLengthError(email.length, EMAIL_MAX_LENGTH);
  }
}

export function checkForNewUserModeration(
  user: User,
  emailDomains: {
    domain: string;
    id: string;
    newUserModeration: "BANNED" | "ALWAYS_PREMOD";
  }[]
) {
  const userEmail = user.email;
  if (userEmail) {
    const userEmailDomain = userEmail.substring(userEmail.indexOf("@") + 1);
    const matchingEmailDomain = emailDomains.find(
      (d) => d.domain === userEmailDomain
    );
    return matchingEmailDomain && matchingEmailDomain.newUserModeration;
  }
  return null;
}
