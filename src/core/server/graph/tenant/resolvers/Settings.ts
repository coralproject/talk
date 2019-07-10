import { GQLSettingsTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "coral-server/models/tenant";

export const Settings: GQLSettingsTypeResolver<Tenant> = {
  staticURI: (tenant, args, ctx) => ctx.config.get("static_uri") || null,
};
