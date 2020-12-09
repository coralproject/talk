import { graphql } from "react-relay";

import { useLocal } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";

import { useStaticFlattenReplies } from "coral-stream/__generated__/useStaticFlattenReplies.graphql";

export default function useStaticFlattenReplies() {
  const [local] = useLocal<useStaticFlattenReplies>(graphql`
    fragment useStaticFlattenReplies on Local {
      staticConfig {
        featureFlags
      }
    }
  `);
  return local.staticConfig.featureFlags.includes(
    GQLFEATURE_FLAG.FLATTEN_REPLIES
  );
}
