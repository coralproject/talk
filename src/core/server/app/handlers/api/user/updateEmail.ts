import Joi from "joi";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
// import { RequestLimiter } from "coral-server/app/request/limiter";
import { AuthenticationError } from "coral-server/errors";
import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";
import { createCollection } from "coral-server/models/helpers";
import { User } from "coral-server/models/user";
import { decodeJWT, extractTokenFromRequest } from "coral-server/services/jwt";
import { RequestHandler } from "coral-server/types/express";

const collections = {
  users: createCollection<User>("users"),
};

type AdminUpdateUserEmailOptions = Pick<
  AppOptions,
  "mongo" | "redis" | "config"
>;

export interface UpdateEmailBody {
  userID?: string;
  email?: string;
}

export const UpdateUserEmailBodySchema = Joi.object().keys({
  userID: Joi.string().default(undefined),
  email: Joi.string().default(undefined),
});

export const userUpdateEmailHandler = ({
  redis,
  config,
  mongo,
}: AdminUpdateUserEmailOptions): RequestHandler => {
  // const ipLimiter = new RequestLimiter({
  //   redis,
  //   ttl: "10m",
  //   max: 10,
  //   prefix: "ip",
  //   config,
  // });
  // const userIDLimiter = new RequestLimiter({
  //   redis,
  //   ttl: "10m",
  //   max: 10,
  //   prefix: "userID",
  //   config,
  // });

  return async (req, res, next) => {
    try {
      // Rate limit based on the IP address
      // await ipLimiter.test(req, req.ip);

      const token = extractTokenFromRequest(req);
      if (!token) {
        // No token? Return not found
        return res.sendStatus(404);
      }

      // Decode the token so we can rate limit based on the user's ID.
      const { sub: userID } = decodeJWT(token);
      if (!userID) {
        return res.sendStatus(400);
      }

      // Rate limit based on requesting user
      // await userIDLimiter.test(req, userID);

      // Tenant is guaranteed at this point.
      const coral = req.coral!;
      const tenant = coral.tenant!;

      // Grab the requesting user.
      const requestingUser = await collections
        .users(mongo)
        .findOne({ id: userID, tenantID: tenant.id });
      if (!requestingUser) {
        throw new AuthenticationError("coult not find requesting user");
      }

      // Only administrators can change emails
      // This makes sense as only admin's should be managing details
      // via this API
      if (requestingUser.role !== GQLUSER_ROLE.ADMIN) {
        throw new Error(
          "only administrators can change a user's email via API"
        );
      }

      const body: UpdateEmailBody = validate(
        UpdateUserEmailBodySchema,
        req.body
      );

      if (!body.userID || !body.email) {
        return res.sendStatus(400);
      }

      // Check if this email already exists, we don't want duplicates
      const emailTakenResult = await collections.users(mongo).findOne({
        email: body.email,
        tenantID: tenant.id,
      });

      if (emailTakenResult && emailTakenResult.email) {
        throw new Error("email already exists");
      }

      // If the email does not exist, update the email
      const updateResult = await collections.users(mongo).findOneAndUpdate(
        {
          id: body.userID,
          tenantID: tenant.id,
        },
        {
          $set: {
            email: body.email,
          },
        },
        {
          returnOriginal: false,
        }
      );

      if (updateResult.value) {
        return res.sendStatus(200);
      }

      return res.sendStatus(400);
    } catch (err) {
      return next(err);
    }
  };
};
