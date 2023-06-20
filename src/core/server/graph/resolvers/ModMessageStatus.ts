import * as user from "coral-server/models/user";

import { GQLModMessageStatusResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export type ModMessageStatusInput = user.ConsolidatedModMessageStatus & {
  userID: string;
};

export const ModMessageStatus: RequiredResolver<
  GQLModMessageStatusResolvers<GraphContext, ModMessageStatusInput>
> = {
  active: ({ active }) => active,
  message: ({ message }) => message,
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
