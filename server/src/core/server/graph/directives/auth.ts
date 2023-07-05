import { DirectiveResolverFn } from "@graphql-tools/utils";
import { CacheScope } from "apollo-cache-control";
import { memoize } from "lodash";

import { setCacheHint } from "coral-common/graphql";
import {
  UserBanned,
  UserForbiddenError,
  UserSuspended,
  UserWarned,
} from "coral-server/errors";
import GraphContext from "coral-server/graph/context";
import { Site } from "coral-server/models/site";
import {
  consolidateUserStatus,
  consolidateUserSuspensionStatus,
  consolidateUserWarningStatus,
  User,
} from "coral-server/models/user";
import { canModerateUnscoped } from "coral-server/models/user/helpers";

import {
  GQLUSER_AUTH_CONDITIONS,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

import { calculateLocationKey } from "./helpers";

// Replace `memoize.Cache`.
memoize.Cache = WeakMap;

export interface AuthDirectiveArgs {
  roles?: GQLUSER_ROLE[];
  userIDField?: string;
  permit?: GQLUSER_AUTH_CONDITIONS[];
  unscoped?: boolean;
}

function calculateAuthConditions(
  user: User,
  site?: Site,
  now: Date = new Date()
): GQLUSER_AUTH_CONDITIONS[] {
  const conditions: GQLUSER_AUTH_CONDITIONS[] = [];

  if (!user.username) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.MISSING_NAME);
  }

  if (!user.email) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.MISSING_EMAIL);
  }

  // Compute the user status.
  const status = consolidateUserStatus(user.status, now, site?.id);
  if (status.ban.active) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.BANNED);
  }

  if (status.suspension.active) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.SUSPENDED);
  }

  if (user.scheduledDeletionDate || user.deletedAt) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.PENDING_DELETION);
  }

  if (status.warning && status.warning.active) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.WARNED);
  }

  return conditions.sort();
}

const calculateAuthConditionsMemoized = memoize(calculateAuthConditions);

const auth: DirectiveResolverFn<
  Record<string, string | undefined>,
  GraphContext
> = (
  next,
  src,
  { roles, userIDField, permit, unscoped = false }: AuthDirectiveArgs,
  { user, site, now },
  info
) => {
  if (
    roles &&
    (roles.includes(GQLUSER_ROLE.ADMIN) ||
      roles.includes(GQLUSER_ROLE.MODERATOR))
  ) {
    setCacheHint(info, { scope: CacheScope.Private });
  }

  // If there is a user on the request.
  if (user) {
    const conditions = calculateAuthConditionsMemoized(user, site, now);
    if (
      // If the permit was not specified, then no conditions can exist on the
      // User, if they do error.
      (!permit && conditions.length > 0) ||
      // If the permit was specified, and some of the conditions for the user
      // aren't in the list of permitted conditions, then error.
      (permit && conditions.some((condition) => !permit.includes(condition)))
    ) {
      // Compute the resource that the user was attempting to access.
      const resource = calculateLocationKey(info);

      if (conditions.includes(GQLUSER_AUTH_CONDITIONS.BANNED)) {
        throw new UserBanned(user.id, resource, info.operation.operation);
      }

      if (conditions.includes(GQLUSER_AUTH_CONDITIONS.WARNED)) {
        const warning = consolidateUserWarningStatus(user.status.warning);
        throw new UserWarned(
          user.id,
          warning.message,
          resource,
          info.operation.operation
        );
      }

      if (conditions.includes(GQLUSER_AUTH_CONDITIONS.SUSPENDED)) {
        const status = consolidateUserSuspensionStatus(
          user.status.suspension,
          now
        );
        if (!status.until) {
          throw new Error(
            "we expected to get an `until` for a suspended user, but did not"
          );
        }

        throw new UserSuspended(
          user.id,
          status.until,
          resource,
          info.operation.operation
        );
      }

      throw new UserForbiddenError(
        "authentication conditions not met",
        resource,
        info.operation.operation,
        user.id,
        permit,
        conditions,
        unscoped
      );
    }

    // If the unscoped check is enabled, then ensure that the user can moderate
    // unscoped.
    if (unscoped && !canModerateUnscoped(user)) {
      throw new UserForbiddenError(
        "user cannot access unscoped resource as they are scoped",
        calculateLocationKey(info),
        info.operation.operation,
        user.id,
        permit,
        conditions,
        unscoped
      );
    }

    // If the role and user owner checks are disabled, then allow them based on
    // their authenticated status.
    if (!roles && !userIDField) {
      return next();
    }

    // And the user has the expected role.
    if (roles && roles.includes(user.role)) {
      // Let the request continue.
      return next();
    }

    // Or the item is owned by the specific user.
    if (userIDField && src[userIDField] && src[userIDField] === user.id) {
      return next();
    }
  }

  throw new UserForbiddenError(
    "user does not have permission to access the resource",
    calculateLocationKey(info),
    info.operation.operation,
    user ? user.id : undefined,
    permit,
    undefined,
    unscoped
  );
};

export default auth;
