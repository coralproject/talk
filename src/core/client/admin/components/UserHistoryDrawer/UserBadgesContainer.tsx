import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import CLASSES from "coral-stream/classes";
import { Tag } from "coral-ui/components/v2";

import { UserBadgesContainer_user$key as UserData } from "coral-admin/__generated__/UserBadgesContainer_user.graphql";

interface Props {
  user: UserData;
}

const UserBadgesContainer: FunctionComponent<Props> = ({ user }) => {
  const userData = useFragment(
    graphql`
      fragment UserBadgesContainer_user on User {
        badges
      }
    `,
    user
  );

  if (!userData.badges) {
    return null;
  }
  return (
    <>
      {userData.badges.map((badge) => (
        <Tag
          key={badge}
          color="dark"
          className={CLASSES.comment.topBar.userBadge}
        >
          {badge}
        </Tag>
      ))}
    </>
  );
};

export default UserBadgesContainer;
