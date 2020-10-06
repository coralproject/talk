import { CacheScope } from "apollo-cache-control";

import {
  GQLEditInfo,
  GQLEditInfoTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const EditInfo: GQLEditInfoTypeResolver<GQLEditInfo> = {
  editableUntil: ({ editableUntil }, args, ctx, info) => {
    if (!editableUntil) {
      return null;
    }

    info.cacheControl.setCacheHint({ scope: CacheScope.Private });

    return editableUntil;
  },
};
