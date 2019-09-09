import Joi from "joi";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { AuthenticationError } from "coral-server/errors";
import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";
import { createCollection } from "coral-server/models/helpers";
import { User } from "coral-server/models/user";
import { decodeJWT, extractTokenFromRequest } from "coral-server/services/jwt";
import { RequestHandler } from "coral-server/types/express";

const collections = {
  users: createCollection<User>("users"),
};

type AdminUpdateUsernameOptions = Pick<
  AppOptions,
  "mongo" | "redis" | "config"
>;

export interface UpdateUsernameBody {
  userID?: string;
  newUserName?: string;
}

export const UpdateUsernameBodySchema = Joi.object().keys({
  userID: Joi.string().default(undefined),
  newUserName: Joi.string().default(undefined),
});

export const userUpdateUsernameHandler = ({
  redis,
  config,
  mongo,
}: AdminUpdateUsernameOptions): RequestHandler => {
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "ip",
    config,
  });
  const userIDLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "userID",
    config,
  });

  return async (req, res, next) => {
    try {
      // Rate limit based on the IP address
      await ipLimiter.test(req, req.ip);

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
      await userIDLimiter.test(req, userID);

      // Tenant is guaranteed at this point.
      const coral = req.coral!;
      const tenant = coral.tenant!;

      // Grab the requesting user.
      const requestingUser = req.user;
      if (!requestingUser) {
        throw new AuthenticationError("no user on request");
      }

      // Only administrators can change usernames
      // This makes sense as only admin's should be managing details
      // via this API
      if (requestingUser.role !== GQLUSER_ROLE.ADMIN) {
        throw new Error("only administrators can change usernames");
      }

      const body: UpdateUsernameBody = validate(
        UpdateUsernameBodySchema,
        req.body
      );

      if (!body.userID || !body.newUserName) {
        return res.sendStatus(400);
      }

      // Check if this username is already taken, we don't want duplicates
      const nameTakenResult = await collections.users(mongo).findOne({
        username: body.newUserName,
        tenantID: tenant.id,
      });

      if (nameTakenResult && nameTakenResult.username) {
        throw new Error("username is already taken");
      }

      // If the username is not taken, update the username
      const updateResult = await collections.users(mongo).findOneAndUpdate(
        {
          userID: body.userID,
          tenantID: tenant.id,
        },
        {
          $set: {
            username: body.newUserName,
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
