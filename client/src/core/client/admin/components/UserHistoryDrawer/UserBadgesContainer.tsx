import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import CLASSES from "coral-stream/classes";
import { Tag } from "coral-ui/components/v2";

import { UserBadgesContainer_user as UserData } from "coral-admin/__generated__/UserBadgesContainer_user.graphql";

import styles from "./UserBadgesContainer.css";

interface Props {
  user: UserData;
}

const UserBadgesContainer: FunctionComponent<Props> = ({ user }) => {
  if (!user.badges) {
    return null;
  }
  return (
    <>
      {user.badges.map((badge) => (
        <span key={badge} className={styles.badgeContainer}>
          <Tag
            color="dark"
            className={cn(styles.badge, CLASSES.comment.topBar.userBadge)}
          >
            {badge}
          </Tag>
        </span>
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
