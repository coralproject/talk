import { AppOptions } from "coral-server/app";
import {
  FacebookAuthenticator,
  getEnabledIntegration,
} from "coral-server/app/authenticators/facebook";

import { oauth2Handler } from "./oauth2";

type Options = Pick<
  AppOptions,
  "tenantCache" | "mongo" | "signingConfig" | "config"
>;

export const facebookHandler = ({ tenantCache, ...options }: Options) =>
  oauth2Handler({
    tenantCache,
    authenticatorFn: (tenant) => {
      const integration = getEnabledIntegration(
        tenant.auth.integrations.facebook
      );

      return new FacebookAuthenticator({
        ...options,
        mongo: options.mongo,
        integration,
        callbackPath: "/api/auth/facebook/callback",
      });
    },
  });
