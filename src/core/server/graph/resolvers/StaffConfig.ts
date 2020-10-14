import * as settings from "coral-server/models/settings";

import { GQLStaffConfigurationTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const StaffConfiguration: GQLStaffConfigurationTypeResolver<settings.StaffConfiguration> = {
  // MIGRATE: plan to remove this in 7.0.0.
  label: (config) => config.label,
  adminLabel: (config) => config.adminLabel || config.label,
  moderatorLabel: (config) => config.moderatorLabel || config.label,
  staffLabel: (config) => config.staffLabel || config.label,
};
