import Joi from "joi";

import { AppOptions } from "talk-server/app";
import { validate } from "talk-server/app/request/body";
import {
  AuthenticationError,
  UserForbiddenError,
  UserNotFoundError,
} from "talk-server/errors";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { retrieveUser, User } from "talk-server/models/user";
import { extractJWTFromRequest } from "talk-server/services/jwt";
import {
  confirmEmail,
  sendConfirmationEmail,
  verifyConfirmTokenString,
} from "talk-server/services/users/auth/confirm";
import { RequestHandler } from "talk-server/types/express";

export type ConfirmRequestOptions = Pick<
  AppOptions,
  "mongo" | "mailerQueue" | "signingConfig"
>;

export interface ConfirmRequestBody {
  userID?: string;
}

export const ConfirmRequestBodySchema = Joi.object()
  .keys({
    userID: Joi.string().default(undefined),
  })
  .optionalKeys(["userID"]);

export const confirmRequestHandler = ({
  mongo,
  mailerQueue,
  signingConfig,
}: ConfirmRequestOptions): RequestHandler => async (req, res, next) => {
  try {
    // TODO: rate limit based on the IP address and user agent.
    // TODO: rate limit based on the user ID.

    // Tenant is guaranteed at this point.
    const talk = req.talk!;
    const tenant = talk.tenant!;

    // Grab the requesting user.
    const requestingUser = req.user;
    if (!requestingUser) {
      throw new AuthenticationError("no user on request");
    }

    // Store the user's ID that should have a email confirmation email sent.
    let targetUserID: string = requestingUser.id;

    // Get the fields from the body. Validate will throw an error if the body
    // does not conform to the specification.
    const body: ConfirmRequestBody = validate(
      ConfirmRequestBodySchema,
      req.body
    );

    // Now check to see if they have specified a userID in the request.
    if (body.userID) {
      // If the user is an admin user, they can request a confirmation email for
      // another user, so check their role.
      if (requestingUser.role === GQLUSER_ROLE.ADMIN) {
        if (body.userID) {
          targetUserID = body.userID;
        }
      } else {
        throw new UserForbiddenError(
          "attempt to send a confirmation email as a non-admin user",
          "/api/account/confirm",
          "POST",
          requestingUser.id
        );
      }
    }

    const log = talk.logger.child({
      targetUserID,
      requestingUserID: requestingUser.id,
      tenantID: tenant.id,
    });

    // Lookup the user.
    const targetUser = await retrieveUser(mongo, tenant.id, targetUserID);
    if (!targetUser) {
      throw new UserNotFoundError(targetUserID);
    }

    await sendConfirmationEmail(
      mongo,
      mailerQueue,
      tenant,
      signingConfig,
      // TODO: (wyattjoh) evaluate the use of required here.
      targetUser as Required<User>,
      talk.now
    );

    log.trace("sent confirm email with token");

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};

export type ConfirmCheckOptions = Pick<AppOptions, "mongo" | "signingConfig">;

export const confirmCheckHandler = ({
  mongo,
  signingConfig,
}: ConfirmCheckOptions): RequestHandler => async (req, res, next) => {
  try {
    // TODO: rate limit based on the IP address and user agent.
    // TODO: rate limit based on the `sub` + `iss` claims.

    // Tenant is guaranteed at this point.
    const talk = req.talk!;
    const tenant = talk.tenant!;

    // TODO: evaluate verifying if the Tenant allows verifications to short circuit.

    // Grab the token from the request.
    const tokenString = extractJWTFromRequest(req, true);
    if (!tokenString) {
      return res.sendStatus(400);
    }

    // Verify the token.
    await verifyConfirmTokenString(
      mongo,
      tenant,
      signingConfig,
      tokenString,
      talk.now
    );

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};

export type ConfirmOptions = Pick<AppOptions, "mongo" | "signingConfig">;

export const confirmHandler = ({
  mongo,
  signingConfig,
}: ConfirmOptions): RequestHandler => async (req, res, next) => {
  try {
    // TODO: rate limit based on the IP address and user agent.
    // TODO: rate limit based on the `sub` + `iss` claims.

    // Tenant is guaranteed at this point.
    const talk = req.talk!;
    const tenant = talk.tenant!;

    // Grab the token from the request.
    const tokenString = extractJWTFromRequest(req, true);
    if (!tokenString) {
      return res.sendStatus(400);
    }

    // Execute the reset.
    await confirmEmail(mongo, tenant, signingConfig, tokenString, talk.now);

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};
