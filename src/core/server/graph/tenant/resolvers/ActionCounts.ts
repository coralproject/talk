import { GQLActionCountsTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as actions from "talk-server/models/action/comment";

export type ActionCountsInput = actions.ActionCounts & {
  commentID: string;
};

export const ActionCounts: GQLActionCountsTypeResolver<ActionCountsInput> = {
  flag: ({ flag, commentID }) => ({
    ...flag,
    commentID,
  }),
};
