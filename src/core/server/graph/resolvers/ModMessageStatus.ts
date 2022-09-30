import * as user from "coral-server/models/user";

import { GQLModMessageStatusTypeResolver } from "coral-server/graph/schema/__generated__/types";

export type ModMessageStatusInput = user.ConsolidatedModMessageStatus & {
  userID: string;
};

export const ModMessageStatus: Required<
  GQLModMessageStatusTypeResolver<ModMessageStatusInput>
> = {
  active: ({ active }) => active,
  message: ({ message }) => message,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
