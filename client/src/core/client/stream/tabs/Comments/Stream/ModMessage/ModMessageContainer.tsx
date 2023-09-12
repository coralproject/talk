import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";

import { ModMessageContainer_viewer } from "coral-stream/__generated__/ModMessageContainer_viewer.graphql";

import AcknowledgeModMessageMutation from "./AcknowledgeModMessageMutation";
import ModMessage from "./ModMessage";

interface Props {
  viewer: ModMessageContainer_viewer | null;
}

const ModMessageContainer: FunctionComponent<Props> = ({ viewer }) => {
  const acknowledgeModMessage = useMutation(AcknowledgeModMessageMutation);
  const onAcknowledge = useCallback(() => {
    void acknowledgeModMessage();
  }, [acknowledgeModMessage]);
  if (!viewer || !viewer.status.modMessage.active) {
    return null;
  }

  return (
    <ModMessage
      // When the modMessage is active, the message is always provided!
      message={viewer.status.modMessage.message!}
      onAcknowledge={onAcknowledge}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment ModMessageContainer_viewer on User {
      status {
        modMessage {
          active
          message
        }
      }
    }
  `,
})(ModMessageContainer);

export default enhanced;
