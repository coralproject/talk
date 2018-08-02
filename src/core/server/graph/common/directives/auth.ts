import { DirectiveResolverFn } from "graphql-tools";

import CommonContext from "talk-server/graph/common/context";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";

export interface AuthDirectiveArgs {
  roles?: GQLUSER_ROLE[];
  userIDField?: string;
}

const auth: DirectiveResolverFn<
  Record<string, string | undefined>,
  CommonContext
> = (next, src, { roles, userIDField }: AuthDirectiveArgs, { user }) => {
  // If there is a user on the request.
  if (user) {
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

  // TODO: return better error.
  throw new Error("not authorized");
};

export default auth;
