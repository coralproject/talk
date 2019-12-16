import { Db } from "mongodb";

import logger from "coral-server/logger";

import collections from "../mongodb/collections";

export class FeatureFlag {
  public id: string;
  public defaultValue: boolean;

  public static warnUserOfToxicComment: FeatureFlag = new FeatureFlag(
    "warnUserOfToxicComment",
    true
  );

  private constructor(id: string, defaulValue: boolean) {
    this.id = id;
    this.defaultValue = defaulValue;
  }
}

const loadFeatureFlag = async (
  mongo: Db,
  tenantID: string,
  flag: FeatureFlag
): Promise<boolean> => {
  try {
    const tenant: any = await collections
      .tenants(mongo)
      .findOne({ id: tenantID });

    if (!tenant) {
      logger.error(
        `unable to find tenant while loading feature flag '${flag.id}', returning default value of: ${flag.defaultValue}`
      );
      return flag.defaultValue;
    }
    if (!tenant.hasOwnProperty("featureFlags")) {
      logger.error(
        `unable to find feature flags on tenant while loading '${flag.id}', returning default value of: ${flag.defaultValue}`
      );
      return flag.defaultValue;
    }

    const featureFlags = tenant.featureFlags;

    if (!featureFlags.hasOwnProperty(flag.id)) {
      logger.error(
        `feature flags does not contain '${flag.id}', returning default value of: ${flag.defaultValue}`
      );
      return flag.defaultValue;
    }

    const value = featureFlags[flag.id];
    return value;
  } catch (err) {
    logger.error(
      { err },
      `an error occurred attempting to load feature flag '${flag.id}', returning default value of: ${flag.defaultValue}`
    );
    return flag.defaultValue;
  }
};

export default loadFeatureFlag;
