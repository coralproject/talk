import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";

import { WarningContainer_viewer } from "coral-stream/__generated__/WarningContainer_viewer.graphql";

import AcknowledgeWarningMutation from "./AcknowledgeWarningMutation";
import Warning from "./Warning";

interface Props {
  viewer: WarningContainer_viewer | null;
}

const WarningContainer: FunctionComponent<Props> = ({ viewer }) => {
  const acknowledgeWarning = useMutation(AcknowledgeWarningMutation);
  const onAcknowledge = useCallback(() => {
    void acknowledgeWarning();
  }, [acknowledgeWarning]);
  if (!viewer || !viewer.status.warning.active) {
    return null;
  }

  return (
    <Warning
      // When the warning is active, the message is always provided!
      message={viewer.status.warning.message!}
      onAcknowledge={onAcknowledge}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment WarningContainer_viewer on User {
      status {
        warning {
          active
          message
        }
      }
    }
  `,
})(WarningContainer);

export default enhanced;
