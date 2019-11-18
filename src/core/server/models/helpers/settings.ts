import { merge } from "lodash";

import { PartialSettings, Settings } from "coral-server/models/settings";

interface SettingsEntity {
  settings: Settings | PartialSettings;
}

interface Tenant {
  settings: Settings;
}

export function consolidate(
  tenant: Tenant,
  community?: SettingsEntity | null,
  site?: SettingsEntity | null,
  story?: SettingsEntity
): Settings {
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
