import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLTAG_RL } from "coral-framework/schema";
import { Tag } from "coral-ui/components/v2";

import { StaffTagContainer_settings$data as StaffTagContainer_settings } from "coral-stream/__generated__/StaffTagContainer_settings.graphql";

import styles from "./StaffTagContainer.css";

interface Props {
  settings: StaffTagContainer_settings;
  tags: GQLTAG_RL[];
  className?: string;
}

const StaffTagContainer: FunctionComponent<Props> = ({
  settings,
  tags,
  className,
}) => {
  return (
    <>
      {tags.includes("ADMIN") && (
        <Tag className={cn(className, styles.tag)}>
          {settings.staff.adminLabel}
        </Tag>
      )}
      {tags.includes("MODERATOR") && (
        <Tag className={cn(className, styles.tag)}>
          {settings.staff.moderatorLabel}
        </Tag>
      )}
      {tags.includes("STAFF") && (
        <Tag className={cn(className, styles.tag)}>
          {settings.staff.staffLabel}
        </Tag>
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment StaffTagContainer_settings on Settings {
      staff {
        staffLabel
        adminLabel
        moderatorLabel
      }
    }
  `,
})(StaffTagContainer);

export default enhanced;
