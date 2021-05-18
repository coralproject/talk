import { Environment } from "react-relay";

import { lookupLocal } from "coral-framework/lib/relay";
import { GQLLocal } from "coral-stream/schema";

export default function lookupFlattenReplies(
  environment: Environment
): boolean {
  return !!lookupLocal<GQLLocal>(environment).flattenReplies;
}
