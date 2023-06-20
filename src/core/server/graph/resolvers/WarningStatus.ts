import * as user from "coral-server/models/user";

import { GQLWarningStatusResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export type WarningStatusInput = user.ConsolidatedWarningStatus & {
  userID: string;
};

export const WarningStatus: RequiredResolver<
  GQLWarningStatusResolvers<GraphContext, WarningStatusInput>
> = {
  active: ({ active }) => active,
  message: ({ message }) => message,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
