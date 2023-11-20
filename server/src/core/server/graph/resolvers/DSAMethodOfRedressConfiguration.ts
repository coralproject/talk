import {
  GQLDSA_METHOD_OF_REDRESS,
  GQLDSAMethodOfRedressConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const DSAMethodOfRedressConfiguration: GQLDSAMethodOfRedressConfigurationTypeResolver =
  {
    method: (config, args, { tenant }) =>
      tenant.dsa?.methodOfRedress?.method ?? GQLDSA_METHOD_OF_REDRESS.NONE,
    email: (config, args, { tenant }) =>
      tenant.dsa?.methodOfRedress?.email ?? "",
    url: (config, args, { tenant }) => tenant.dsa?.methodOfRedress?.url ?? "",
  };
