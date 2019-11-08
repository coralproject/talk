import TenantContext from "coral-server/graph/tenant/context";
import { Site } from "coral-server/models/site";
import { create, updateSettings } from "coral-server/services/sites";

import {
  GQLCreateSiteInput,
  GQLUpdateSiteSettingsInput,
} from "coral-server/graph/tenant/schema/__generated__/types";

export const Sites = (ctx: TenantContext) => ({
  create: async ({
    communityID,
    ...rest
  }: GQLCreateSiteInput): Promise<Readonly<Site | null>> =>
    create(ctx.mongo, ctx.tenant, communityID, rest, ctx.now),
  updateSettings: async ({
    siteID,
    settings,
  }: GQLUpdateSiteSettingsInput): Promise<Readonly<Site | null>> =>
    updateSettings(ctx.mongo, ctx.tenant, siteID, settings),
});
