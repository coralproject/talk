import { useLocal } from "coral-framework/lib/relay";
import { graphql } from "react-relay";

import { useCommentSeenEnabledLocal } from "coral-stream/__generated__/useCommentSeenEnabledLocal.graphql";

/**
 * Returns true when the comment seen feature is enabled.
 */
export default function useCommentSeenEnabled() {
  const [local] = useLocal<useCommentSeenEnabledLocal>(graphql`
    fragment useCommentSeenEnabledLocal on Local {
      enableCommentSeen
    }
  `);

  return local.enableCommentSeen;
}
