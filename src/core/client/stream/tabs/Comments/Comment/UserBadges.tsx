import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Tag } from "coral-ui/components";

interface Props {
  badges: string[];
}

const UserBadges: FunctionComponent<Props> = props => {
  return (
    <>
      {props.badges.map(badge => (
        <Tag key={badge} color="dark" className={CLASSES.comment.userBadge}>
          {badge}
        </Tag>
      ))}
    </>
  );
};

export default UserBadges;
