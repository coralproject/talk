import { GQLBannedStatusTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as user from "talk-server/models/user";

export type BannedStatusInput = user.ConsolidatedBannedStatus & {
  userID: string;
};

export const BannedStatus: Required<
  GQLBannedStatusTypeResolver<BannedStatusInput>
> = {
  active: ({ active }) => active,
  history: ({ history, userID }) =>
    history.map(status => ({ ...status, userID })),
};
