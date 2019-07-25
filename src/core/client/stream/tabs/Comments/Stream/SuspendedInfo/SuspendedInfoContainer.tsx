import { withFragmentContainer } from "coral-framework/lib/relay";
import { SuspendedInfoContainer_settings as SettingsData } from "coral-stream/__generated__/SuspendedInfoContainer_settings.graphql";
import { SuspendedInfoContainer_viewer as UserData } from "coral-stream/__generated__/SuspendedInfoContainer_viewer.graphql";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import SuspendedInfo from "./SuspendedInfo";

interface Props {
  settings: SettingsData;
  viewer: UserData | null;
}

export const SuspendedInfoContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
}) => {
  if (!viewer) {
    return null;
  }
  return (
    <SuspendedInfo
      until={viewer.status.suspension.until}
      organization={settings.organization.name}
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
  settings: graphql`
    fragment SuspendedInfoContainer_settings on Settings {
      organization {
        name
      }
    }
  `,
})(SuspendedInfoContainer);

export default enhanced;
