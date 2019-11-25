import React, { FunctionComponent } from "react";

import { Ability, can } from "coral-admin/permissions";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { InviteUsersContainer_organization } from "coral-admin/__generated__/InviteUsersContainer_organization.graphql";
import { InviteUsersContainer_viewer } from "coral-admin/__generated__/InviteUsersContainer_viewer.graphql";

import InviteUsers from "./InviteUsers";

interface Props {
  viewer: InviteUsersContainer_viewer | null;
  organization: InviteUsersContainer_organization | null;
}

const InviteUsersContainer: FunctionComponent<Props> = ({
  viewer,
  organization,
}) => {
  if (!viewer || !can(viewer, Ability.INVITE_USERS)) {
    return null;
  }

  if (
    !organization ||
    !organization.auth.integrations.local.enabled ||
    !organization.auth.integrations.local.allowRegistration ||
    !organization.auth.integrations.local.targetFilter.admin ||
    !organization.settings.email.enabled
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
  organization: graphql`
    fragment InviteUsersContainer_organization on Organization {
      settings {
        email {
          enabled
        }
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
