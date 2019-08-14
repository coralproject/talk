import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { UserBadgesContainer_user as UserData } from "coral-admin/__generated__/UserBadgesContainer_user.graphql";
import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";

import CLASSES from "coral-stream/classes";
import { Tag } from "coral-ui/components";

interface Props {
  user: UserData;
}

const UserBadgesContainer: FunctionComponent<Props> = ({ user }) => {
  if (!user.badges) {
    return null;
  }
  return (
    <>
      {user.badges.map(badge => (
        <Tag key={badge} color="dark" className={CLASSES.comment.userBadge}>
          {badge}
        </Tag>
      ))}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment UserBadgesContainer_user on User {
      badges
    }
  `,
})(UserBadgesContainer);

export default enhanced;
