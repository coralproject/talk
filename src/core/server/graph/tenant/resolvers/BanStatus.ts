import { GQLBanStatusTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as user from "talk-server/models/user";

export type BanStatusInput = user.ConsolidatedBanStatus & {
  userID: string;
};

export const BanStatus: Required<GQLBanStatusTypeResolver<BanStatusInput>> = {
  active: ({ active }) => active,
  history: ({ history, userID }) =>
    history.map(status => ({ ...status, userID })),
};
