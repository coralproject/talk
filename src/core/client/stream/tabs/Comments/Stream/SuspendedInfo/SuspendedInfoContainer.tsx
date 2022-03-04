import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { SuspendedInfoContainer_settings$key as SettingsData } from "coral-stream/__generated__/SuspendedInfoContainer_settings.graphql";
import { SuspendedInfoContainer_viewer$key as ViewerData } from "coral-stream/__generated__/SuspendedInfoContainer_viewer.graphql";

import SuspendedInfo from "./SuspendedInfo";

interface Props {
  settings: SettingsData;
  viewer: ViewerData | null;
}

export const SuspendedInfoContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment SuspendedInfoContainer_viewer on User {
        status {
          suspension {
            until
          }
        }
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment SuspendedInfoContainer_settings on Settings {
        organization {
          name
        }
      }
    `,
    settings
  );

  if (!viewerData) {
    return null;
  }
  return (
    <SuspendedInfo
      until={viewerData.status.suspension.until!}
      organization={settingsData.organization.name}
    />
  );
};

export default SuspendedInfoContainer;
