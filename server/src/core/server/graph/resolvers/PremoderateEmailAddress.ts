import {
  GQLPremoderateEmailAddressConfiguration,
  GQLPremoderateEmailAddressConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const PremoderateEmailAddressConfiguration: GQLPremoderateEmailAddressConfigurationTypeResolver<GQLPremoderateEmailAddressConfiguration> =
  {
    tooManyPeriods: (config) =>
      config && config.tooManyPeriods
        ? config.tooManyPeriods
        : { enabled: false },
  };
