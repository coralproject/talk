import { merge } from "lodash";

import { PartialSettings, Settings } from "coral-server/models/settings";

interface FullSettingsEntity {
  ownSettings: Settings;
}

interface PartialSettingsEntity {
  ownSettings: PartialSettings;
}

export function consolidate(
  base: FullSettingsEntity,
  ...entities: PartialSettingsEntity[]
): Settings {
  return merge({}, base.ownSettings, ...entities.map(e => e.ownSettings));
}
