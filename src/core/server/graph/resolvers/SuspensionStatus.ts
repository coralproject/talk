import * as user from "coral-server/models/user";

import { GQLSuspensionStatusResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export type SuspensionStatusInput = user.ConsolidatedSuspensionStatus & {
  userID: string;
};

export const SuspensionStatus: RequiredResolver<
  GQLSuspensionStatusResolvers<GraphContext, SuspensionStatusInput>
> = {
  active: ({ active }) => active,
  until: ({ until }) => until,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
