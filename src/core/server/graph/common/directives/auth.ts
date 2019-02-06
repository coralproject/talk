import { DirectiveResolverFn } from "graphql-tools";
import { memoize } from "lodash";

import { GraphQLResolveInfo, ResponsePath } from "graphql";
import { UserForbiddenError } from "talk-server/errors";
import CommonContext from "talk-server/graph/common/context";
import {
  GQLUSER_AUTH_CONDITIONS,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { User } from "talk-server/models/user";

// Replace `memoize.Cache`.
memoize.Cache = WeakMap;

export interface AuthDirectiveArgs {
  roles?: GQLUSER_ROLE[];
  userIDField?: string;
  permit?: GQLUSER_AUTH_CONDITIONS[];
}

function calculateAuthConditions(user: User): GQLUSER_AUTH_CONDITIONS[] {
  const conditions: GQLUSER_AUTH_CONDITIONS[] = [];

  if (!user.username && !user.displayName) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.MISSING_NAME);
  }

  if (!user.email) {
    conditions.push(GQLUSER_AUTH_CONDITIONS.MISSING_EMAIL);
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
  { user },
  info
) => {
  // If there is a user on the request.
  if (user) {
    // If the permit was not specified, then no conditions can exist on the
    // User, if they do error.
    const conditions = calculateAuthConditionsMemoized(user);
    if (!permit && conditions.length > 0) {
      throw new UserForbiddenError(
        "authentication conditions not met",
        calculateLocationKey(info),
        user.id
      );
    }

    // If the permit was specified, and some of the conditions for the user
    // aren't in the list of permitted conditions, then error.
    if (
      permit &&
      conditions.some(condition => permit.indexOf(condition) === -1)
    ) {
      throw new UserForbiddenError(
        "authentication conditions not met",
        calculateLocationKey(info),
        user.id
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
    user ? user.id : null
  );
};

export default auth;
