import * as user from "coral-server/models/user";

import { GQLSuspensionStatusTypeResolver } from "coral-server/graph/schema/__generated__/types";

export type SuspensionStatusInput = user.ConsolidatedSuspensionStatus & {
  userID: string;
};

export const SuspensionStatus: Required<
  GQLSuspensionStatusTypeResolver<SuspensionStatusInput>
> = {
  active: ({ active }) => active,
  until: ({ until }) => until,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
