import * as user from "coral-server/models/user";

import { GQLBanStatusTypeResolver } from "coral-server/graph/schema/__generated__/types";

export type BanStatusInput = user.ConsolidatedBanStatus & {
  userID: string;
};

export const BanStatus: Required<GQLBanStatusTypeResolver<BanStatusInput>> = {
  sites: (status, input, ctx) => status.sites,
  active: ({ active }) => active,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
