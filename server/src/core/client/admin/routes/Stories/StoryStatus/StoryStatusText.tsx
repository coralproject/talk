import cn from "classnames";
import React, { FunctionComponent } from "react";

import TranslatedStoryStatus from "coral-admin/components/TranslatedStoryStatus";
import { GQLSTORY_STATUS_RL } from "coral-framework/schema";

import styles from "./StoryStatusText.css";

interface Props {
  children: GQLSTORY_STATUS_RL;
  isArchiving?: boolean;
  isArchived?: boolean;
  isUnarchiving?: boolean;
}

const StoryStatusText: FunctionComponent<Props> = (props) => (
  <TranslatedStoryStatus
    container={
      <span
        className={cn(styles.root, {
          [styles.open]: props.children === "OPEN",
        })}
      />
    }
    isArchiving={props.isArchiving}
    isArchived={props.isArchived}
    isUnarchiving={props.isUnarchiving}
  >
    {props.children}
  </TranslatedStoryStatus>
);

export default StoryStatusText;
