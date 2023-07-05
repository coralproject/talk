import * as user from "coral-server/models/user";

import { GQLWarningStatusTypeResolver } from "coral-server/graph/schema/__generated__/types";

export type WarningStatusInput = user.ConsolidatedWarningStatus & {
  userID: string;
};

export const WarningStatus: Required<
  GQLWarningStatusTypeResolver<WarningStatusInput>
> = {
  active: ({ active }) => active,
  message: ({ message }) => message,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
