import {
  GQLExternalMediaConfiguration,
  GQLExternalMediaConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const ExternalMediaConfiguration: Required<GQLExternalMediaConfigurationTypeResolver<
  Partial<GQLExternalMediaConfiguration>
>> = {
  enabled: ({ enabled = false }) => enabled,
};
