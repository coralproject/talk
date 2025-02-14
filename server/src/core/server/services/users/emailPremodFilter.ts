import { MongoContext } from "coral-server/data/context";
import { NewUserModeration } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { emailIsAlias } from "./helpers";

export const EMAIL_PREMOD_FILTER_PERIOD_LIMIT = 3;

const emailHasTooManyPeriods = (
  tenant: Readonly<Tenant>,
  email: string | undefined,
  limit: number
) => {
  if (!tenant?.premoderateEmailAddress?.tooManyPeriods?.enabled) {
    return false;
  }

  if (!email) {
    return false;
  }

  const split = email.split("@");
  if (split.length < 2) {
    return false;
  }

  const firstHalf = split[0];

  let periodCount = 0;
  for (const char of firstHalf) {
    if (char === ".") {
      periodCount++;
    }
  }

  return periodCount >= limit;
};

const emailIsAnAliasOfExistingUser = async (
  mongo: MongoContext,
  tenant: Readonly<Tenant>,
  email: string | undefined
) => {
  if (!email) {
    return false;
  }

  const { isAlias, baseEmail: base } = emailIsAlias(email);
  if (!isAlias || !base) {
    return false;
  }

  // only pre-mod if user is an alias of an existing
  // user
  //
  // mods and admins regularly use aliases for all
  // their users, so it is less likely they will use
  // their base email in our system.
  const existingUser = await mongo
    .users()
    .findOne({ tenantID: tenant.id, email: base.fullBaseEmail });

  return !!existingUser;
};

const emailIsOnAutoBanList = (
  email: string | undefined,
  tenant: Readonly<Tenant>
): boolean => {
  if (!email) {
    return false;
  }

  const emailSplit = email.split("@");
  if (emailSplit.length < 2) {
    return false;
  }

  const domain = emailSplit[1].trim().toLowerCase();

  const autoBanRecord = tenant.emailDomainModeration?.find(
    (record) =>
      record.domain.toLowerCase() === domain &&
      record.newUserModeration === NewUserModeration.BAN
  );

  return !!autoBanRecord;
};

export const shouldPremodDueToLikelySpamEmail = async (
  mongo: MongoContext | undefined = undefined,
  tenant: Readonly<Tenant>,
  user: Readonly<User>
) => {
  // don't need to premod a user that is already premoderated
  if (user.status.premod.active) {
    return false;
  }

  // if user is no longer pre-modded, but was because of this spam
  // email check, don't return true again because staff probably
  // removed the premod status.
  if (!user.status.premod.active && user.premoderatedBecauseOfEmailAt) {
    return false;
  }

  // if a user is on auto ban list, they will become banned via their
  // domain, therefore, we don't want to undo the ban by applying a
  // premod state (that would un-ban them)
  if (emailIsOnAutoBanList(user.email, tenant)) {
    return false;
  }

  // this is an array to allow for adding more rules in the
  // future as we play whack-a-mole trying to block spammers
  // and other trouble makers
  const results = [
    emailHasTooManyPeriods(
      tenant,
      user.email,
      EMAIL_PREMOD_FILTER_PERIOD_LIMIT
    ),
    // premod email aliases if the feature is enabled
    tenant?.premoderateEmailAddress?.emailAliases?.enabled && mongo
      ? await emailIsAnAliasOfExistingUser(mongo, tenant, user.email)
      : false,
  ];

  return results.some((v) => v === true);
};
