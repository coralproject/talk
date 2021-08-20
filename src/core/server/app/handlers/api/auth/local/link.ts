import Joi from "joi";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { linkUsersAvailable } from "coral-server/models/tenant";
import { signTokenString } from "coral-server/services/jwt";
import { link } from "coral-server/services/users";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export interface LinkBody {
  email: string;
  password: string;
}

export const LinkBodySchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().email(),
  password: Joi.string(),
});

export type LinkOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "mailerQueue" | "redis" | "config"
>;

export const linkHandler = ({
  redis,
  mongo,
  signingConfig,
  config,
}: LinkOptions): RequestHandler<TenantCoralRequest> => {
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "ip",
    config,
  });

  return async (req, res, next) => {
    try {
      // Rate limit based on the IP address and user agent.
      await ipLimiter.test(req, req.ip);

      const { tenant, now } = req.coral;

      // Check to ensure that the local integration has been enabled.
      if (!linkUsersAvailable(tenant)) {
        throw new Error("cannot link users, not available");
      }

      // Get the fields from the body. Validate will throw an error if the body
      // does not conform to the specification.
      const { email, password }: LinkBody = validate(LinkBodySchema, req.body);

      // Start the account linking process. We are assured the user at this
      // point because of the middleware inserted before which rejects any
      // unauthenticated requests.
      const user = await link(mongo.main, tenant, req.user!, {
        email,
        password,
      });

      // Account linking is complete! Return the new access token for the
      // request.
      const token = await signTokenString(signingConfig, user, tenant, {}, now);

      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  };
};
