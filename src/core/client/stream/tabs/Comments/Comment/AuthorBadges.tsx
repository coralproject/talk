import React, { FunctionComponent } from "react";

import { Tag } from "coral-ui/components/v2";

interface Props {
  badges: ReadonlyArray<string>;
  className?: string;
}

const AuthorBadges: FunctionComponent<Props> = ({ badges, className }) => (
  <>
    {badges.map((badge) => (
      <Tag key={badge} color="dark" className={className}>
        {badge}
      </Tag>
    ))}
  </>
);

export default AuthorBadges;
