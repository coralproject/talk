import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";

import { WarningContainer_settings } from "coral-stream/__generated__/WarningContainer_settings.graphql";
import { WarningContainer_viewer } from "coral-stream/__generated__/WarningContainer_viewer.graphql";

import AcknowledgeWarningMutation from "./AcknowledgeWarningMutation";
import Warning from "./Warning";

interface Props {
  viewer: WarningContainer_viewer | null;
  settings: WarningContainer_settings;
}

const WarningContainer: FunctionComponent<Props> = ({ viewer, settings }) => {
  const acknowledgeWarning = useMutation(AcknowledgeWarningMutation);
  const onAcknowledge = useCallback(() => acknowledgeWarning(), [
    acknowledgeWarning,
  ]);
  if (!viewer || !viewer.status.warning.active) {
    return null;
  }
  return (
    <Warning
      message={viewer.status.warning.message || ""}
      onAcknowledge={onAcknowledge}
      organizationName={settings.organization.name}
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
  settings: graphql`
    fragment WarningContainer_settings on Settings {
      organization {
        name
      }
    }
  `,
})(WarningContainer);

export default enhanced;
