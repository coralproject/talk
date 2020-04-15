import { GQLBanStatusTypeResolver } from "coral-server/graph/schema/__generated__/types";
import * as user from "coral-server/models/user";

export type BanStatusInput = user.ConsolidatedBanStatus & {
  userID: string;
};

export const BanStatus: Required<GQLBanStatusTypeResolver<BanStatusInput>> = {
  active: ({ active }) => active,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
