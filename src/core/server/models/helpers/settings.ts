import { merge } from "lodash";

import { PartialSettings, Settings } from "coral-server/models/settings";

interface FullSettingsEntity {
  settings: Settings;
}

interface PartialSettingsEntity {
  settings: PartialSettings;
}

export function consolidate(
  base: FullSettingsEntity,
  ...entities: PartialSettingsEntity[]
): Settings {
  return merge({}, base.settings, ...entities.map(e => e.settings));
}
