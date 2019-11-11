import { merge } from "lodash";

import { PartialSettings, Settings } from "coral-server/models/settings";

interface SettingsEntity {
  settings: Settings | PartialSettings;
}

export function consolidate(
  tenant: SettingsEntity,
  community?: SettingsEntity | null,
  site?: SettingsEntity | null,
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
  if (story) {
    return merge({}, tenant.settings, story.settings);
  }
  return tenant.settings;
}
