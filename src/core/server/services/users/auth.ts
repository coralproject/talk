import { Db } from "mongodb";

import { Tenant } from "talk-server/models/tenant";
import { JWTSigningConfig } from "talk-server/services/jwt";

export function generateResetURL(
  mongo: Db,
  tenant: Tenant,
  signingConfig: JWTSigningConfig,
  userID: string,
  redirectURI: string,
  now: Date = new Date()
) {
  // FIXME: (wyattjoh) implement
  return "";
}
