import { NewUserModeration } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";

export const EMAIL_PREMOD_FILTER_PERIOD_LIMIT = 3;

const emailHasTooManyPeriods = (email: string | undefined, limit: number) => {
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

export const shouldPremodDueToLikelySpamEmail = (
  tenant: Readonly<Tenant>,
  user: Readonly<User>
) => {
  // don't premod check unless the filter is enabled
  if (!tenant?.premoderateEmailAddress?.tooManyPeriods?.enabled) {
    return false;
  }

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

  if (emailIsOnAutoBanList(user.email, tenant)) {
    return false;
  }

  // this is an array to allow for adding more rules in the
  // future as we play whack-a-mole trying to block spammers
  // and other trouble makers
  const results = [
    emailHasTooManyPeriods(user.email, EMAIL_PREMOD_FILTER_PERIOD_LIMIT),
  ];

  return results.some((v) => v === true);
};
