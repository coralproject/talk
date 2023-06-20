import * as settings from "coral-server/models/settings";

import { GQLEmailDomainResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const EmailDomain: GQLEmailDomainResolvers<
  GraphContext,
  settings.EmailDomain
> = {
  domain: ({ domain }) => domain,
  newUserModeration: ({ newUserModeration }) => newUserModeration,
};
