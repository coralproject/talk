import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { SuspendedInfoContainer_organization as OrgData } from "coral-stream/__generated__/SuspendedInfoContainer_organization.graphql";
import { SuspendedInfoContainer_viewer as ViewerData } from "coral-stream/__generated__/SuspendedInfoContainer_viewer.graphql";

import SuspendedInfo from "./SuspendedInfo";

interface Props {
  organization: OrgData;
  viewer: ViewerData | null;
}

export const SuspendedInfoContainer: FunctionComponent<Props> = ({
  organization,
  viewer,
}) => {
  if (!viewer) {
    return null;
  }
  return (
    <SuspendedInfo
      until={viewer.status.suspension.until}
      organization={organization.name}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment SuspendedInfoContainer_viewer on User {
      status {
        suspension {
          until
        }
      }
    }
  `,
  organization: graphql`
    fragment SuspendedInfoContainer_organization on Organization {
      name
    }
  `,
})(SuspendedInfoContainer);

export default enhanced;
