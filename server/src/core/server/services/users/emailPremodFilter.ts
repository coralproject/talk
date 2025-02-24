import { Redis } from "ioredis";

import { DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY } from "coral-common/common/lib/constants";
import { MongoContext } from "coral-server/data/context";
import { NewUserModeration } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { STAFF_ROLES } from "coral-server/models/user/constants";
import {
  emailIsAlias,
  findBaseUserForAlias,
  findUsersSimilarToEmail,
} from "./helpers";

export const EMAIL_PREMOD_FILTER_PERIOD_LIMIT = 3;

const emailHasTooManyPeriods = (firstHalf: string, limit: number) => {
  let periodCount = 0;
  for (const char of firstHalf) {
    if (char === ".") {
      periodCount++;
    }
  }

  return periodCount >= limit;
};

const emailIsOnDisposableEmailsList = async (domain: string, redis: Redis) => {
  const userEmailDomainIsDisposable = await redis.get(
    `${domain}${DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY}`
  );

  return !!userEmailDomainIsDisposable;
};

const emailIsOnAutoBanList = (
  domain: string,
  tenant: Readonly<Tenant>
): boolean => {
  const autoBanRecord = tenant.emailDomainModeration?.find(
    (record) =>
      record.domain.toLowerCase() === domain &&
      record.newUserModeration === NewUserModeration.BAN
  );

  return !!autoBanRecord;
};

const emailIsAnAliasOfExistingUser = async (
  mongo: MongoContext,
  tenant: Readonly<Tenant>,
  email: string | undefined
) => {
  // if it is not an alias, can't have another alias or base email
  // user
  const isAlias = emailIsAlias(email);
  if (!isAlias) {
    return false;
  }

  // see if the base user (no alias) is a staff member, if so
  // don't premod them
  const baseUser = await findBaseUserForAlias(mongo, tenant.id, email);
  if (baseUser && STAFF_ROLES.includes(baseUser.role)) {
    return false;
  }

  // if we still have a base user who is not a staff member, premod
  // this alias as it's likely spam
  if (baseUser) {
    return true;
  }

  // if there are other emails similar to this alias, then we've found
  // more aliases of this alias
  const similarUsers = await findUsersSimilarToEmail(mongo, email, 5);
  return similarUsers.length > 0;
};

export const shouldPremodDueToLikelySpamEmail = async (
  mongo: MongoContext | undefined = undefined,
  tenant: Readonly<Tenant>,
  redis: Redis,
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

  if (!user.email) {
    return false;
  }

  const emailSplit = user.email.split("@");
  if (emailSplit.length < 2) {
    return false;
  }

  const emailFirstHalf = emailSplit[0];
  const domain = emailSplit[1].trim().toLowerCase();

  // if a user is on auto ban list, they will become banned via their
  // domain, therefore, we don't want to undo the ban by applying a
  // premod state (that would un-ban them)
  if (emailIsOnAutoBanList(domain, tenant)) {
    return false;
  }

  // if domain is included in protected email domains, we should
  // not pre-moderate it
  if (tenant?.protectedEmailDomains?.includes(domain)) {
    return false;
  }

  // this is an array to allow for adding more rules in the
  // future as we play whack-a-mole trying to block spammers
  // and other trouble makers
  const results = [
    !!tenant.premoderateEmailAddress?.tooManyPeriods?.enabled &&
      emailHasTooManyPeriods(emailFirstHalf, EMAIL_PREMOD_FILTER_PERIOD_LIMIT),
    !!tenant.disposableEmailDomains?.enabled &&
      (await emailIsOnDisposableEmailsList(domain, redis)),
    // premod email aliases if the feature is enabled
    mongo &&
      !!tenant?.premoderateEmailAddress?.emailAliases?.enabled &&
      (await emailIsAnAliasOfExistingUser(mongo, tenant, user.email)),
  ];

  return results.some((v) => v === true);
};
