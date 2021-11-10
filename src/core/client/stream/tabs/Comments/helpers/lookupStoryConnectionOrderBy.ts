import { Environment } from "react-relay";

import { LOCAL_ID, lookup } from "coral-framework/lib/relay";

export default function lookupStoryConnectionOrderBy(
  environment: Environment
): string {
  return lookup(environment, LOCAL_ID).commentsOrderBy;
}
