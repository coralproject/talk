import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { useMutation } from "coral-framework/lib/relay";

import { WarningContainer_viewer$key as WarningContainer_viewer } from "coral-stream/__generated__/WarningContainer_viewer.graphql";

import AcknowledgeWarningMutation from "./AcknowledgeWarningMutation";
import Warning from "./Warning";

interface Props {
  viewer: WarningContainer_viewer | null;
}

const WarningContainer: FunctionComponent<Props> = ({ viewer }) => {
  const viewerData = useFragment(
    graphql`
      fragment WarningContainer_viewer on User {
        status {
          warning {
            active
            message
          }
        }
      }
    `,
    viewer
  );

  const acknowledgeWarning = useMutation(AcknowledgeWarningMutation);
  const onAcknowledge = useCallback(() => {
    void acknowledgeWarning();
  }, [acknowledgeWarning]);
  if (!viewerData || !viewerData.status.warning.active) {
    return null;
  }

  return (
    <Warning
      // When the warning is active, the message is always provided!
      message={viewerData.status.warning.message!}
      onAcknowledge={onAcknowledge}
    />
  );
};

export default WarningContainer;
