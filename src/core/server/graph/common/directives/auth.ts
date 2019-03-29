import { DirectiveResolverFn } from "graphql-tools";
import { memoize } from "lodash";

import { GraphQLResolveInfo, ResponsePath } from "graphql";
import {
  UserBanned,
  UserForbiddenError,
  UserSuspended,
} from "talk-server/errors";
import CommonContext from "talk-server/graph/common/context";
import {
  GQLUSER_AUTH_CONDITIONS,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  consolidateUserStatus,
  consolidateUserSuspensionStatus,
  User,
} from "talk-server/models/user";

// Replace `memoize.Cache`.
memoize.Cache = WeakMap;

export interface AuthDirectiveArgs {
  roles?: GQLUSER_ROLE[];
  userIDField?: string;
  permit?: GQLUSER_AUTH_CONDITIONS[];
}

function calculateAuthConditions(
  user: User,
  now: Date
): GQLUSER_AUTH_CONDITIONS[] {
  const conditions: GQLUSER_AUTH_CONDITIONS[] = [];

  if (!user.username) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.MISSING_NAME);
  }

  if (!user.email) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.MISSING_EMAIL);
  }

  // Compute the user status.
  const status = consolidateUserStatus(user.status, now);
  if (status.banned.active) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.BANNED);
  }

  if (status.suspension.active) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.SUSPENDED);
  }

  return conditions.sort();
}

/**
 * calculateLocationKey will reduce the resolve information to determine the
 * path to where the key that is being accessed.
 *
 * @param info the info from the graph request
 */
function calculateLocationKey(info: Pick<GraphQLResolveInfo, "path">): string {
  // Guard against invalid input.
  if (!info || !info.path || !info.path.key) {
    return "";
  }

  // Grab the first part of the path.
  const parts: string[] = [info.path.key.toString()];

  // Grab the parent previous part of the path.
  let prev: ResponsePath | undefined = info.path.prev;

  // While there is still a previous part of the path, keep looping to find the
  // all the parts.
  while (prev && prev.key) {
    // Push the key into the front of the array.
    parts.unshift(prev.key.toString());

    // Change the selection to the previous path element.
    prev = prev.prev;
  }

  // Join it together with a dotted path.
  return parts.join(".");
}

const calculateAuthConditionsMemoized = memoize(calculateAuthConditions);

const auth: DirectiveResolverFn<
  Record<string, string | undefined>,
  CommonContext
> = (
  next,
  src,
  { roles, userIDField, permit }: AuthDirectiveArgs,
  { user, now },
  info
) => {
  // If there is a user on the request.
  if (user) {
    const conditions = calculateAuthConditionsMemoized(user, now);
    if (
      // If the permit was not specified, then no conditions can exist on the
      // User, if they do error.
      (!permit && conditions.length > 0) ||
      // If the permit was specified, and some of the conditions for the user
      // aren't in the list of permitted conditions, then error.
      (permit && conditions.some(condition => !permit.includes(condition)))
    ) {
      // Compute the resource that the user was attempting to access.
      const resource = calculateLocationKey(info);

      if (conditions.includes(GQLUSER_AUTH_CONDITIONS.BANNED)) {
        throw new UserBanned(user.id, resource, info.operation.operation);
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
        conditions
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
    user ? user.id : undefined
  );
};

export default auth;
