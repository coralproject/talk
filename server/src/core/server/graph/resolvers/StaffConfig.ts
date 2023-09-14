import * as settings from "coral-server/models/settings";

import { GQLBadgeConfigurationTypeResolver } from "coral-server/graph/schema/__generated__/types";
import { translate } from "coral-server/services/i18n";

export const BadgeConfiguration: GQLBadgeConfigurationTypeResolver<settings.BadgeConfiguration> =
  {
    // MIGRATE: plan to remove this in 7.0.0.
    label: (config) => config.label,
    adminLabel: (config) => config.adminLabel || config.label,
    moderatorLabel: (config) => config.moderatorLabel || config.label,
    staffLabel: (config) => config.staffLabel || config.label,
    memberLabel: (config, args, ctx) => {
      if (config.memberLabel) {
        return config.memberLabel;
      }

      const bundle = ctx.i18n.getBundle(ctx.tenant.locale);
      return translate(bundle, "Member", "member-label");
    },
  };
