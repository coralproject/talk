import * as settings from "coral-server/models/settings";

import { GQLEmailDomainTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const EmailDomain: GQLEmailDomainTypeResolver<settings.EmailDomain> = {
  domain: ({ domain }) => domain,
  newUserModeration: ({ newUserModeration }) => newUserModeration,
};
