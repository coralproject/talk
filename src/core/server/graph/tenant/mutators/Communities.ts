import TenantContext from "coral-server/graph/tenant/context";
import { Community } from "coral-server/models/community";
import { create, updateSettings } from "coral-server/services/communities";

import {
  GQLCreateCommunityInput,
  GQLUpdateCommunitySettingsInput,
} from "coral-server/graph/tenant/schema/__generated__/types";

export const Communities = (ctx: TenantContext) => ({
  create: async (
    input: GQLCreateCommunityInput
  ): Promise<Readonly<Community | null>> =>
    create(ctx.mongo, ctx.tenant, input, ctx.now),
  updateSettings: async ({
    communityID,
    settings,
  }: GQLUpdateCommunitySettingsInput): Promise<Readonly<Community | null>> =>
    updateSettings(ctx.mongo, ctx.tenant, communityID, settings),
});
