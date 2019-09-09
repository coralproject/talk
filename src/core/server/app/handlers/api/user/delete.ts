import Joi from "joi";
import { DateTime } from "luxon";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { deleteUser } from "coral-server/cron/accountDeletion.ts";
import { AuthenticationError } from "coral-server/errors";
import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";
import { createCollection } from "coral-server/models/helpers";
import { User } from "coral-server/models/user";
import { decodeJWT, extractTokenFromRequest } from "coral-server/services/jwt";
import { RequestHandler } from "coral-server/types/express";

const collections = {
  users: createCollection<User>("users"),
};

type AdminDeleteUserOptions = Pick<
  AppOptions,
  "mongo" | "redis" | "config" | "mailerQueue"
>;

export interface DeleteUserBody {
  userID?: string;
}

export const DeleteUserBodySchema = Joi.object().keys({
  userID: Joi.string().default(undefined),
});

export const userDeleteHandler = ({
  redis,
  config,
  mongo,
  mailerQueue,
}: AdminDeleteUserOptions): RequestHandler => {
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
      const requestingUser = await collections
        .users(mongo)
        .findOne({ id: userID, tenantID: tenant.id });
      if (!requestingUser) {
        throw new AuthenticationError("coult not find requesting user");
      }

      // Only administrators can change usernames
      // This makes sense as only admin's should be managing details
      // via this API
      if (requestingUser.role !== GQLUSER_ROLE.ADMIN) {
        throw new Error("only administrators can delete users");
      }

      const body: DeleteUserBody = validate(DeleteUserBodySchema, req.body);

      if (!body.userID) {
        return res.sendStatus(400);
      }

      // Try and find user, if we find them, push their deletion date
      // ahead just in case they were scheduled for deletion, we don't
      // want a race condition with the scheduled deletion tasks
      const now = new Date();
      const rescheduledDeletionDate = DateTime.fromJSDate(now)
        .plus({ hours: 1 })
        .toJSDate();
      const { value: user } = await collections.users(mongo).findOneAndUpdate(
        {
          id: body.userID,
          tenantID: tenant.id,
        },
        {
          $set: {
            scheduledDeletionDate: rescheduledDeletionDate,
          },
        },
        {
          // We want to get back the user with
          // modified scheduledDeletionDate
          returnOriginal: false,
        }
      );

      // If user does not exist, return that they are deleted
      if (!user) {
        return res.sendStatus(200);
      }

      // If the user exists, delete them
      await deleteUser(mongo, mailerQueue, body.userID, tenant.id, now);

      return res.sendStatus(200);
    } catch (err) {
      return next(err);
    }
  };
};
