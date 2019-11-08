import { merge } from "lodash";

import { PartialSettings, Settings } from "coral-server/models/settings";

interface SettingsEntity {
  settings: Settings | PartialSettings;
}

export function consolidate(
  tenant: SettingsEntity,
  community?: SettingsEntity,
  site?: SettingsEntity,
  story?: SettingsEntity
): PartialSettings {
  if (community) {
    if (site) {
      if (story) {
        return merge(
          {},
          tenant.settings,
          community.settings,
          site.settings,
          story.settings
        );
      }
      return merge({}, tenant.settings, community.settings, site.settings);
    }
    return merge({}, tenant.settings, community.settings);
  }
  return tenant.settings;
}
