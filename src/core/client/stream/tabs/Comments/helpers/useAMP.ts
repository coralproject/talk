import { graphql } from "react-relay";

import { useLocal } from "coral-framework/lib/relay";

import { useAMP } from "coral-stream/__generated__/useAMP.graphql";

export default function useAMP() {
  const [local] = useLocal<useAMP>(graphql`
    fragment useAMP on Local {
      amp
    }
  `);
  return local.amp;
}
