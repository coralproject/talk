import { AppOptions } from "coral-server/app";
import {
  FacebookAuthenticator,
  getEnabledIntegration,
} from "coral-server/app/authenticators/facebook";

import { oauth2Handler } from "./oauth2";

type Options = Pick<AppOptions, "tenantCache" | "mongo" | "signingConfig">;

export const facebookHandler = ({
  tenantCache,
  mongo,
  signingConfig,
}: Options) =>
  oauth2Handler({
    tenantCache,
    authenticatorFn: (tenant) => {
      const integration = getEnabledIntegration(
        tenant.auth.integrations.facebook
      );

      return new FacebookAuthenticator({
        signingConfig,
        mongo,
        integration,
        callbackPath: "/api/auth/facebook/callback",
      });
    },
  });
