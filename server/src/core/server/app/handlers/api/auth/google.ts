import { AppOptions } from "coral-server/app";
import {
  getEnabledIntegration,
  GoogleAuthenticator,
} from "coral-server/app/authenticators/google";

import { oauth2Handler } from "./oauth2";

type Options = Pick<
  AppOptions,
  "tenantCache" | "mongo" | "signingConfig" | "config"
>;

export const googleHandler = ({ tenantCache, ...options }: Options) =>
  oauth2Handler({
    tenantCache,
    authenticatorFn: (tenant) => {
      const integration = getEnabledIntegration(
        tenant.auth.integrations.google
      );

      return new GoogleAuthenticator({
        ...options,
        mongo: options.mongo,
        integration,
        callbackPath: "/api/auth/google/callback",
      });
    },
  });
