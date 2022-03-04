import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { useMutation } from "coral-framework/lib/relay";

import { ModMessageContainer_viewer$key as ModMessageContainer_viewer } from "coral-stream/__generated__/ModMessageContainer_viewer.graphql";

import AcknowledgeModMessageMutation from "./AcknowledgeModMessageMutation";
import ModMessage from "./ModMessage";

interface Props {
  viewer: ModMessageContainer_viewer | null;
}

const ModMessageContainer: FunctionComponent<Props> = ({ viewer }) => {
  const viewerData = useFragment(
    graphql`
      fragment ModMessageContainer_viewer on User {
        status {
          modMessage {
            active
            message
          }
        }
      }
    `,
    viewer
  );

  const acknowledgeModMessage = useMutation(AcknowledgeModMessageMutation);
  const onAcknowledge = useCallback(() => {
    void acknowledgeModMessage();
  }, [acknowledgeModMessage]);
  if (!viewerData || !viewerData.status.modMessage.active) {
    return null;
  }

  return (
    <ModMessage
      // When the modMessage is active, the message is always provided!
      message={viewerData.status.modMessage.message!}
      onAcknowledge={onAcknowledge}
    />
  );
};

export default ModMessageContainer;
