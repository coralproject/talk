import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLTAG_RL } from "coral-framework/schema";
import { Tag } from "coral-ui/components/v2";

import { BadgeTagContainer_settings } from "coral-stream/__generated__/BadgeTagContainer_settings.graphql";

import styles from "./BadgeTagContainer.css";

interface Props {
  settings: BadgeTagContainer_settings;
  tags: GQLTAG_RL[];
  className?: string;
}

const BadgeTagContainer: FunctionComponent<Props> = ({
  settings,
  tags,
  className,
}) => {
  return (
    <>
      {tags.includes("ADMIN") && (
        <Tag className={cn(className, styles.tag)}>
          {settings.badges.adminLabel}
        </Tag>
      )}
      {tags.includes("MODERATOR") && (
        <Tag className={cn(className, styles.tag)}>
          {settings.badges.moderatorLabel}
        </Tag>
      )}
      {tags.includes("STAFF") && (
        <Tag className={cn(className, styles.tag)}>
          {settings.badges.staffLabel}
        </Tag>
      )}
      {tags.includes("MEMBER") && (
        <Tag className={cn(className, styles.tag)}>
          {settings.badges.memberLabel}
        </Tag>
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment BadgeTagContainer_settings on Settings {
      badges {
        staffLabel
        adminLabel
        moderatorLabel
        memberLabel
      }
    }
  `,
})(BadgeTagContainer);

export default enhanced;
