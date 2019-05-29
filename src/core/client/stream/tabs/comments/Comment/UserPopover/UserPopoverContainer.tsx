import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import NotAvailable from "coral-admin/components/NotAvailable";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { UserPopoverContainer_user as UserData } from "coral-stream/__generated__/UserPopoverContainer_user.graphql";

import UserPopover from "./UserPopover";

interface Props {
  user: UserData;
}

export const UserPopoverContainer: FunctionComponent<Props> = ({ user }) => {
  return (
    <UserPopover
      createdAt={user.createdAt}
      username={user.username || <NotAvailable />}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment UserPopoverContainer_user on User {
      username
      createdAt
    }
  `,
})(UserPopoverContainer);

export default enhanced;
