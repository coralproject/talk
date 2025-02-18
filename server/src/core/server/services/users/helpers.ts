import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "coral-common/common/lib/helpers/validate";
import { MongoContext } from "coral-server/data/context";
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

/**
 * checkforNewUserEmailDomainModeration will check the new user's email address domain against
 * configured email domains to see if the user should be automatically banned or set
 * to always pre-moderated by the system
 * @param user user to be checked against email domains
 * @param emailDomainModeration email domains configured with new user moderation settings
 */
export function checkForNewUserEmailDomainModeration(
  user: User,
  emailDomainModeration: Array<{
    domain: string;
    id: string;
    newUserModeration: "BAN" | "PREMOD";
  }>
) {
  const userEmail = user.email;
  if (userEmail && emailDomainModeration) {
    const userEmailDomain = userEmail.substring(userEmail.indexOf("@") + 1);
    const matchingEmailDomain = emailDomainModeration.find((d) => {
      const domainMatchIndex = userEmailDomain.indexOf(d.domain);
      if (domainMatchIndex !== -1) {
        // either matches the userEmailDomain or is a subdomain of it
        return (
          domainMatchIndex === 0 ||
          userEmailDomain[domainMatchIndex - 1] === "."
        );
      }
      return false;
    });
    return matchingEmailDomain && matchingEmailDomain.newUserModeration;
  }
  return null;
}

interface EmailIsAliasResult {
  baseEmail?: {
    fullBaseEmail: string;
    baseEmailWithoutDomain: string;
    domain: string;
  } | null;
  aliasEmail?: {
    fullAliasEmail: string;
    aliasEmailWithoutDomain: string;
    domain: string;
  } | null;
  isAlias: boolean;
}

interface BaseEmailResult {
  fullEmail: string;
  domain: string;
  address: string;
}

export function computeBaseEmailFromAlias(
  email?: string | null
): BaseEmailResult | null {
  if (!email) {
    return null;
  }

  // all emails must contain one @ sign between
  // the address and domain
  const emailSplit = email.split("@");
  if (emailSplit.length !== 2) {
    return null;
  }

  // address is the first part of the email
  // before the @ sign
  const address = emailSplit[0];
  const domain = emailSplit[1];

  // strip the alias away from the address to get its base
  const aliasSplit = address.split("+");
  const baseAddress = aliasSplit[0];

  const baseEmail = `${baseAddress}@${domain}`;

  return {
    fullEmail: baseEmail,
    address: baseAddress,
    domain,
  };
}

const RegexSpecialCharacters = [
  "\\",
  "^",
  "$",
  ".",
  "|",
  "?",
  "*",
  "+",
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
];

export const sanitizeStringForRegex = (value: string) => {
  let modified = value;

  for (const c of RegexSpecialCharacters) {
    const globalReplace = new RegExp(`\\${c}`, "g");
    modified = modified.replace(globalReplace, `\\${c}`);
  }

  return modified;
};

export async function findUsersSimilarToEmail(
  mongo: MongoContext,
  email?: string | null,
  count?: number
) {
  if (!email) {
    return [];
  }

  const base = computeBaseEmailFromAlias(email);
  if (!base) {
    return [];
  }

  const regexFriendlyAddress = sanitizeStringForRegex(base.address);
  const regexFriendlyDomain = sanitizeStringForRegex(base.domain);
  const regex = new RegExp(`^${regexFriendlyAddress}.*${regexFriendlyDomain}$`);

  const query = mongo.users().find({ email: { $regex: regex } });

  if (count !== undefined && count > 0) {
    query.limit(count);
  }

  const users = await query.toArray();
  const otherUsers = users.filter((u) => u.email !== email);

  return otherUsers ?? [];
}

export function parseEmailAliasIntoParts(
  email?: string | null
): EmailIsAliasResult {
  if (!email) {
    return {
      baseEmail: null,
      aliasEmail: null,
      isAlias: false,
    };
  }

  const emailSplit = email.split("@");
  if (emailSplit.length < 2) {
    return {
      baseEmail: null,
      aliasEmail: null,
      isAlias: false,
    };
  }

  const address = emailSplit[0];
  const aliasSplit = address.split("+");
  if (aliasSplit.length <= 1) {
    return {
      baseEmail: null,
      aliasEmail: null,
      isAlias: false,
    };
  }

  const domain = emailSplit[1];
  const aliasStart = emailSplit[0];
  const baseOfAlias = aliasSplit[0];
  const baseEmail = `${baseOfAlias}@${domain}`;

  return {
    baseEmail: {
      fullBaseEmail: baseEmail,
      baseEmailWithoutDomain: baseOfAlias,
      domain,
    },
    aliasEmail: {
      fullAliasEmail: email,
      aliasEmailWithoutDomain: aliasStart,
      domain,
    },
    isAlias: true,
  };
}

export const emailIsAlias = (email?: string | null) => {
  if (!email) {
    return false;
  }

  const atSplit = email.split("@");
  if (atSplit.length !== 2) {
    return false;
  }

  const address = atSplit[0];
  const aliasSplit = address.split("+");

  return aliasSplit.length === 2;
};

export const findBaseUserForAlias = async (
  mongo: MongoContext,
  tenantID: string,
  email: string | undefined
) => {
  if (!email) {
    return null;
  }

  const base = computeBaseEmailFromAlias(email);
  if (!base) {
    return null;
  }

  const existingUser = await mongo
    .users()
    .findOne({ tenantID, email: base.fullEmail });

  return existingUser ?? null;
};
