import * as user from "coral-server/models/user";

import { GQLBanStatusResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export type BanStatusInput = user.ConsolidatedBanStatus & {
  userID: string;
};

export const BanStatus: RequiredResolver<
  GQLBanStatusResolvers<GraphContext, BanStatusInput>
> = {
  sites: ({ siteIDs }, input, ctx) =>
    siteIDs ? ctx.loaders.Sites.site.loadMany(siteIDs) : null,
  active: ({ active }) => active,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
