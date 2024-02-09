import * as user from "coral-server/models/user";

import { GQLUserDeletionStatusTypeResolver } from "coral-server/graph/schema/__generated__/types";

export type UserDeletionStatusInput = user.ConsolidatedUserDeletionStatus & {
  userID: string;
};

export const UserDeletionStatus: Required<
  GQLUserDeletionStatusTypeResolver<UserDeletionStatusInput>
> = {
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
