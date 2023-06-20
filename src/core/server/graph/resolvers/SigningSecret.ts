import * as settings from "coral-server/models/settings";

import { GQLSigningSecretResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const SigningSecret: GQLSigningSecretResolvers<
  GraphContext,
  settings.SigningSecret
> = {
  lastUsedAt: async ({ kid }, args, ctx) =>
    ctx.loaders.Auth.retrieveSSOSigningSecretLastUsedAt.load(kid),
};
