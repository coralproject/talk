import * as settings from "coral-server/models/settings";

import { GQLSecretTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const Secret: GQLSecretTypeResolver<settings.Secret> = {
  lastUsedAt: async ({ kid }, args, ctx) =>
    ctx.loaders.Auth.retrieveSSOKeyLastUsedAt.load(kid),
};
