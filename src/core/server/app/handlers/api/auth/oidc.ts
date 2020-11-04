import { AppOptions } from "coral-server/app";
import {
  getEnabledIntegration,
  OIDCAuthenticator,
} from "coral-server/app/authenticators/oidc";

import { oauth2Handler } from "./oauth2";

type Options = Pick<
  AppOptions,
  "tenantCache" | "mongo" | "signingConfig" | "redis"
>;

export const oidcHandler = ({
  tenantCache,
  mongo,
  redis,
  signingConfig,
}: Options) =>
  oauth2Handler({
    tenantCache,
    authenticatorFn: (tenant) => {
      const integration = getEnabledIntegration(tenant.auth.integrations.oidc);

      return new OIDCAuthenticator({
        signingConfig,
        mongo,
        redis,
        integration,
        callbackPath: "/api/auth/oidc/callback",
      });
    },
  });
