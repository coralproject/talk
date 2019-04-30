import Joi from "joi";

import { AppOptions } from "talk-server/app";
import { handleSuccessfulLogin } from "talk-server/app/middleware/passport";
import { validate } from "talk-server/app/request/body";
import { IntegrationDisabled } from "talk-server/errors";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { LocalProfile, User } from "talk-server/models/user";
import { insert } from "talk-server/services/users";
import { sendConfirmationEmail } from "talk-server/services/users/auth";
import { RequestHandler } from "talk-server/types/express";

export interface SignupBody {
  username: string;
  password: string;
  email: string;
}

export const SignupBodySchema = Joi.object().keys({
  username: Joi.string().trim(),
  password: Joi.string(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email(),
});

export type SignupOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "mailerQueue"
>;

export const signupHandler = ({
  mongo,
  signingConfig,
  mailerQueue,
}: SignupOptions): RequestHandler => async (req, res, next) => {
  try {
    // TODO: rate limit based on the IP address and user agent.

    // Tenant is guaranteed at this point.
    const tenant = req.talk!.tenant!;
    const now = req.talk!.now;

    // Check to ensure that the local integration has been enabled.
    if (!tenant.auth.integrations.local.enabled) {
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

    // Configure with profile.
    const profile: LocalProfile = {
      id: email,
      type: "local",
      password,
    };

    // Create the new user.
    const user = await insert(
      mongo,
      tenant,
      {
        email,
        username,
        profiles: [profile],
        // New users signing up via local auth will have the commenter role to
        // start with.
        role: GQLUSER_ROLE.COMMENTER,
      },
      now
    );

    // Send off the confirm email.
    await sendConfirmationEmail(
      mongo,
      mailerQueue,
      tenant,
      signingConfig,
      user as Required<User>,
      now
    );

    // Send off to the passport handler.
    return handleSuccessfulLogin(user, signingConfig, req, res, next);
  } catch (err) {
    return next(err);
  }
};
