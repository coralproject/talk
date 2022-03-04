import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { Ability, can } from "coral-admin/permissions";

import { InviteUsersContainer_settings$key as InviteUsersContainer_settings } from "coral-admin/__generated__/InviteUsersContainer_settings.graphql";
import { InviteUsersContainer_viewer$key as InviteUsersContainer_viewer } from "coral-admin/__generated__/InviteUsersContainer_viewer.graphql";

import InviteUsers from "./InviteUsers";

interface Props {
  viewer: InviteUsersContainer_viewer | null;
  settings: InviteUsersContainer_settings | null;
}

const InviteUsersContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment InviteUsersContainer_viewer on User {
        role
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment InviteUsersContainer_settings on Settings {
        email {
          enabled
        }
        auth {
          integrations {
            local {
              enabled
              allowRegistration
              targetFilter {
                admin
              }
            }
          }
        }
      }
    `,
    settings
  );

  if (!viewerData || !can(viewerData, Ability.INVITE_USERS)) {
    return null;
  }

  if (
    !settingsData ||
    !settingsData.auth.integrations.local.enabled ||
    !settingsData.auth.integrations.local.allowRegistration ||
    !settingsData.auth.integrations.local.targetFilter.admin ||
    !settingsData.email.enabled
  ) {
    return null;
  }

  return <InviteUsers />;
};

export default InviteUsersContainer;
