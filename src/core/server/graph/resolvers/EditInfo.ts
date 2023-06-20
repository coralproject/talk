import { CacheScope } from "apollo-cache-control";

import { setCacheHint } from "coral-common/graphql";

import {
  GQLEditInfo,
  GQLEditInfoResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const EditInfo: GQLEditInfoResolvers<GraphContext, GQLEditInfo> = {
  editableUntil: ({ editableUntil }, args, ctx, info) => {
    if (!editableUntil) {
      return null;
    }

    setCacheHint(info, { scope: CacheScope.Private });

    return editableUntil;
  },
};
