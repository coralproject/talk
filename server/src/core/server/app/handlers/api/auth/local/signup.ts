import Joi from "joi";
import { v4 as uuid } from "uuid";

import { AppOptions } from "coral-server/app";
import { handleSuccessfulLogin } from "coral-server/app/middleware/passport";
import { validate } from "coral-server/app/request/body";
import {
  RequestLimiter,
  RequestLimiterOptions,
} from "coral-server/app/request/limiter";
import {
  IntegrationDisabled,
  UsernameAlreadyExists,
} from "coral-server/errors";
import { hasEnabledAuthIntegration } from "coral-server/models/tenant";
import {
  LocalProfile,
  premodUser,
  PremodUserReason,
  User,
} from "coral-server/models/user";
import { create, usernameAlreadyExists } from "coral-server/services/users";
import { sendConfirmationEmail } from "coral-server/services/users/auth";
import { shouldPremodDueToLikelySpamEmail } from "coral-server/services/users/emailPremodFilter";
import {
  AsyncRequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export interface SignupBody {
  username: string;
  password: string;
  email: string;
}

export const SignupBodySchema = Joi.object().keys({
  username: Joi.string().trim(),
  password: Joi.string(),
  email: Joi.string().trim().lowercase().email(),
});

export type SignupOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "mailerQueue" | "redis" | "config"
> & { limiterOptions?: RequestLimiterOptions };

export const signupHandler = ({
  config,
  redis,
  mongo,
  signingConfig,
  mailerQueue,
  limiterOptions,
}: SignupOptions): AsyncRequestHandler<TenantCoralRequest> => {
  const ipLimiter = new RequestLimiter(
    limiterOptions ?? {
      redis,
      ttl: "10m",
      max: 10,
      prefix: "ip",
      config,
    }
  );

  return async (req, res, next) => {
    try {
      // Rate limit based on the IP address and user agent.
      await ipLimiter.test(req, req.ip);

      const { tenant, now } = req.coral;

      // Check to ensure that the local integration has been enabled.
      if (!hasEnabledAuthIntegration(config, tenant, "local")) {
        throw new IntegrationDisabled("local");
      }

      if (!tenant.auth.integrations.local.allowRegistration) {
        // TODO: replace with better error.
        return next(new Error("registration is disabled"));
      }

      // Get the fields from the body. Validate will throw an error if the body
      // does not conform to the specification.
      const { username, password, email }: SignupBody = validate(
        SignupBodySchema,
        req.body
      );

      const alreadyExists = await usernameAlreadyExists(
        mongo,
        tenant,
        username
      );
      if (alreadyExists) {
        return next(new UsernameAlreadyExists(tenant.id, username));
      }

      // Configure with profile.
      const profile: LocalProfile = {
        id: email,
        type: "local",
        password,
        passwordID: uuid(),
      };

      // Create the new user.
      const user = await create(
        mongo,
        tenant,
        {
          email,
          username,
          profile,
          // New users signing up via local auth will have the commenter role to
          // start with.
          role: GQLUSER_ROLE.COMMENTER,
        },
        {},
        now
      );

      // Send off the confirm email.
      await sendConfirmationEmail(
        mongo,
        mailerQueue,
        tenant,
        config,
        signingConfig,
        user as Required<User>,
        now
      );

      if (shouldPremodDueToLikelySpamEmail(tenant, user)) {
        await premodUser(
          mongo,
          tenant.id,
          user.id,
          undefined,
          now,
          PremodUserReason.EmailPremodFilter
        );
      }

      // Send off to the passport handler.
      return handleSuccessfulLogin(user, signingConfig, req, res, next);
    } catch (err) {
      return next(err);
    }
  };
};
