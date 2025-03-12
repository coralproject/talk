import { AppOptions } from "coral-server/app";
import {
  BskyAuthenticator,
  getEnabledIntegration,
} from "coral-server/app/authenticators/bsky";

import { atprotoHandler } from "./atproto";

type Options = Pick<
  AppOptions,
  "tenantCache" | "mongo" | "signingConfig" | "config"
>;

export const bskyHandler = ({ tenantCache, ...options }: Options) =>
  atprotoHandler({
    tenantCache,
    authenticatorFn: (tenant) => {
      const integration = getEnabledIntegration(tenant.auth.integrations.bsky);

      return new BskyAuthenticator({
        ...options,
        mongo: options.mongo,
        integration,
        callbackPath: "/api/auth/bsky/callback",
      });
    },
  });
