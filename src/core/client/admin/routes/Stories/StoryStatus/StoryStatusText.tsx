import cn from "classnames";
import React, { FunctionComponent } from "react";

import TranslatedStoryStatus from "coral-admin/components/TranslatedStoryStatus";
import { GQLSTORY_STATUS_RL } from "coral-framework/schema";

import styles from "./StoryStatusText.css";

interface Props {
  children: GQLSTORY_STATUS_RL;
}

const StoryStatusText: FunctionComponent<Props> = props => (
  <TranslatedStoryStatus
    container={
      <span
        className={cn(styles.root, {
          [styles.open]: props.children === "OPEN",
        })}
      />
    }
  >
    {props.children}
  </TranslatedStoryStatus>
);

export default StoryStatusText;
