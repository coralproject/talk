import * as user from "coral-server/models/user";

import { GQLUsernameStatusResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export type UsernameStatusInput = user.ConsolidatedUsernameStatus & {
  userID: string;
};

export const UsernameStatus: RequiredResolver<
  GQLUsernameStatusResolvers<GraphContext, UsernameStatusInput>
> = {
  history: ({ history, userID }) =>
    history.map((status) => ({ ...status, userID })),
};
