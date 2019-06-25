import React, { FunctionComponent } from "react";

import { InviteUsersContainer_viewer as ViewerData } from "coral-admin/__generated__/InviteUsersContainer_viewer.graphql";
import { Ability, can } from "coral-admin/permissions";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import InviteUsers from "./InviteUsers";

interface Props {
  viewer: ViewerData | null;
}

const InviteUsersContainer: FunctionComponent<Props> = ({ viewer }) => {
  if (!viewer || !can(viewer, Ability.INVITE_USERS)) {
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
})(InviteUsersContainer);

export default enhanced;
