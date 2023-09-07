import {
  GQLPremoderateEmailAddressConfig,
  GQLPremoderateEmailAddressConfigTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const PremoderateEmailAddressConfig: GQLPremoderateEmailAddressConfigTypeResolver<GQLPremoderateEmailAddressConfig> =
  {
    tooManyPeriods: (config) =>
      config && config.tooManyPeriods
        ? config.tooManyPeriods
        : { enabled: false },
  };
