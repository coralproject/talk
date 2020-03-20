import * as settings from "coral-server/models/settings";

import { GQLSigningSecretTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const SigningSecret: GQLSigningSecretTypeResolver<settings.Secret> = {
  lastUsedAt: async ({ kid }, args, ctx) =>
    ctx.loaders.Auth.retrieveSSOSigningSecretLastUsedAt.load(kid),
};
