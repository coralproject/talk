import { MongoContext } from "coral-server/data/context";
import { Tenant } from "coral-server/models/tenant";

import { parseEmailAliasIntoParts, sanitizeStringForRegex } from "./helpers";

export const shouldBanEmailBecauseOtherAliasesAreBanned = async (
  mongo: MongoContext,
  tenant: Readonly<Tenant>,
  email?: string | null
) => {
  if (!email) {
    return false;
  }

  if (!tenant?.premoderateEmailAddress?.tooManyPeriods?.enabled) {
    return false;
  }

  const { isAlias, baseEmail: base } = parseEmailAliasIntoParts(email);
  if (!isAlias || !base) {
    return false;
  }

  const regexFriendlyAddress = sanitizeStringForRegex(
    base.baseEmailWithoutDomain
  );
  const regexFriendlyDomain = sanitizeStringForRegex(base.domain);
  const regex = new RegExp(`^${regexFriendlyAddress}.*${regexFriendlyDomain}$`);

  const usersCursor = mongo.users().find({ email: { $regex: regex } });
  while (await usersCursor.hasNext()) {
    const user = await usersCursor.next();
    if (!user) {
      continue;
    }

    if (user.status.ban.active) {
      return true;
    }
  }

  return false;
};
