import * as user from "coral-server/models/user";

import { GQLPremodStatusTypeResolver } from "coral-server/graph/schema/__generated__/types";

export type PremodStatusInput = user.ConsolidatedPremodStatus & {
  userID: string;
};

export const PremodStatus: Required<
  GQLPremodStatusTypeResolver<PremodStatusInput>
> = {
  active: ({ active }) => active,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
