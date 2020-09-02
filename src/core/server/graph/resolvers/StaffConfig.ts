import * as settings from "coral-server/models/settings";

import { GQLStaffConfigurationTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const StaffConfiguration: GQLStaffConfigurationTypeResolver<settings.StaffConfiguration> = {
  // MIGRATE: plan to remove this in 7.0.0.
  label: (config, args, { tenant }) => tenant.staff.label,
  adminLabel: (config, args, { tenant }) =>
    tenant.staff.adminLabel || tenant.staff.label,
  moderatorLabel: (config, args, { tenant }) =>
    tenant.staff.moderatorLabel || tenant.staff.label,
  staffLabel: (config, args, { tenant }) =>
    tenant.staff.staffLabel || tenant.staff.label,
};
