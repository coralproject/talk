import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { Ability, can } from "coral-admin/permissions";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { InviteUsersContainer_settings$data as InviteUsersContainer_settings } from "coral-admin/__generated__/InviteUsersContainer_settings.graphql";
import { InviteUsersContainer_viewer$data as InviteUsersContainer_viewer } from "coral-admin/__generated__/InviteUsersContainer_viewer.graphql";

import InviteUsers from "./InviteUsers";

interface Props {
  viewer: InviteUsersContainer_viewer | null;
  settings: InviteUsersContainer_settings | null;
}

const InviteUsersContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => {
  if (!viewer || !can(viewer, Ability.INVITE_USERS)) {
    return null;
  }

  if (
    !settings ||
    !settings.auth.integrations.local.enabled ||
    !settings.auth.integrations.local.allowRegistration ||
    !settings.auth.integrations.local.targetFilter.admin ||
    !settings.email.enabled
  ) {
    return null;
  }

  return <InviteUsers />;
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment InviteUsersContainer_viewer on User {
      role
    }
  `,
  settings: graphql`
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
})(InviteUsersContainer);

export default enhanced;
