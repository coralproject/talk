import { graphql } from "react-relay";

import { useLocal } from "coral-framework/lib/relay";

import { useStaticFlattenReplies } from "coral-stream/__generated__/useStaticFlattenReplies.graphql";

export default function useStaticFlattenReplies() {
  const [local] = useLocal<useStaticFlattenReplies>(graphql`
    fragment useStaticFlattenReplies on Local {
      flattenReplies
    }
  `);
  return local.flattenReplies;
}
