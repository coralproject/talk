import { defaultTo } from "lodash";

import * as community from "coral-server/models/community";

import { GQLCommunityTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

export const Community: GQLCommunityTypeResolver<community.Community> = {
  settings: (s, input, ctx) => ctx.loaders.Communities.settings.load(s.id),
  sites: ({ id }, { first, after }, ctx) =>
    ctx.loaders.Sites.connection({
      first: defaultTo(first, 10),
      after,
      filter: {
        communityID: id,
      },
    }),
};
