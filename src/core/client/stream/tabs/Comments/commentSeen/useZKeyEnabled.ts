import { useLocal } from "coral-framework/lib/relay";
import { graphql } from "react-relay";

import { useZKeyEnabledLocal } from "coral-stream/__generated__/useZKeyEnabledLocal.graphql";

/**
 * Returns true when the comment seen feature is enabled.
 */
export default function useZKeyEnabled() {
  const [local] = useLocal<useZKeyEnabledLocal>(graphql`
    fragment useZKeyEnabledLocal on Local {
      enableCommentSeen
      enableZKey
    }
  `);

  return local.enableZKey && local.enableCommentSeen;
}
