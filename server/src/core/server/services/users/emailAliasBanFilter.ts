import { MongoContext } from "coral-server/data/context";
import { emailIsAlias } from "./helpers";

export const shouldBanEmailBecauseOtherAliasesAreBanned = async (
  mongo: MongoContext,
  email?: string | null
) => {
  if (!email) {
    return false;
  }

  const { isAlias, baseEmail: base } = emailIsAlias(email);
  if (!isAlias || !base) {
    return false;
  }

  const regex = new RegExp(`^${base.baseEmailWithoutDomain}.*${base.domain}$`);

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
