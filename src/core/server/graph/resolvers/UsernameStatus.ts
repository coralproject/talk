import * as user from "coral-server/models/user";

import { GQLUsernameStatusTypeResolver } from "coral-server/graph/schema/__generated__/types";

export type UsernameStatusInput = user.ConsolidatedUsernameStatus & {
  userID: string;
};

export const UsernameStatus: Required<
  GQLUsernameStatusTypeResolver<UsernameStatusInput>
> = {
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
