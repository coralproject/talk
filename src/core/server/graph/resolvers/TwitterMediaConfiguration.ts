import {
  GQLTwitterMediaConfiguration,
  GQLTwitterMediaConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const TwitterMediaConfiguration: Required<
  GQLTwitterMediaConfigurationTypeResolver<
    Partial<GQLTwitterMediaConfiguration>
  >
> = {
  enabled: ({ enabled = false }) => enabled,
};
