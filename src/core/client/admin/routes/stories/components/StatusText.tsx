import cn from "classnames";
import React, { FunctionComponent } from "react";

import TranslatedStoryStatus from "talk-admin/components/TranslatedStoryStatus";

import { GQLSTORY_STATUS_RL } from "talk-framework/schema";
import styles from "./StatusText.css";

interface Props {
  children: GQLSTORY_STATUS_RL;
}

const StatusText: FunctionComponent<Props> = props => (
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

export default StatusText;
