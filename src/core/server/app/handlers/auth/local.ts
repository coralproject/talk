import { RequestHandler } from "express";
import Joi from "joi";
import { Db } from "mongodb";

import { handle } from "talk-server/app/middleware/passport";
import { validate } from "talk-server/app/request/body";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { LocalProfile } from "talk-server/models/user";
import { upsert } from "talk-server/services/users";
import { Request } from "talk-server/types/express";

export interface SignupBody {
  username: string;
  password: string;
  email: string;
  displayName?: string;
}

const SignupBodySchema = Joi.object().keys({
  username: Joi.string().trim(),
  password: Joi.string().trim(),
  email: Joi.string().trim(),
});

// Extends the default signup body schema to allow the displayName to be set.
const SignupDisplayNameBodySchema = SignupBodySchema.keys({
  displayName: Joi.string().trim(),
});

export interface SignupOptions {
  db: Db;
}

export const signupHandler = ({ db }: SignupOptions): RequestHandler => async (
  req: Request,
  res,
  next
) => {
  try {
    // TODO: rate limit based on the IP address and user agent.

    // Tenant is guaranteed at this point.
    const tenant = req.tenant!;

    // Check to ensure that the local integration has been enabled.
    if (!tenant.auth.integrations.local.enabled) {
      // TODO: replace with better error.
      return next(new Error("integration is disabled"));
    }

    // Get the fields from the body. We condition on the display name being
    // enabled to allow the display name to be stripped in the event that the
    // display name is not enabled, yielding a displayName being `undefined`,
    // which will not be set in the resultant document. Validate will throw an
    // error if the body does not conform to the specification.
    const { username, password, email, displayName }: SignupBody = validate(
      tenant.auth.displayNameEnable
        ? SignupDisplayNameBodySchema
        : SignupBodySchema,
      req.body
    );

    // Configure with profile.
    const profile: LocalProfile = {
      id: email,
      type: "local",
    };

    // Create the new user.
    const user = await upsert(db, tenant, {
      email,
      username,
      displayName,
      password,
      profiles: [profile],
      // New users signing up via local auth will have the commenter role to
      // start with.
      role: GQLUSER_ROLE.COMMENTER,
    });

    // Send off to the passport handler.
    return handle(null, user)(req, res, next);
  } catch (err) {
    return handle(err)(req, res, next);
  }
};
