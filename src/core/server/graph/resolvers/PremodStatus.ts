import * as user from "coral-server/models/user";

import { GQLPremodStatusResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export type PremodStatusInput = user.ConsolidatedPremodStatus & {
  userID: string;
};

export const PremodStatus: RequiredResolver<
  GQLPremodStatusResolvers<GraphContext, PremodStatusInput>
> = {
  active: ({ active }) => active,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
