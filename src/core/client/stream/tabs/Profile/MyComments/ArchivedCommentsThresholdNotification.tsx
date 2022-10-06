import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { reduceSeconds } from "coral-common/helpers";
import TIME from "coral-common/time";

import styles from "./ArchivedCommentsThresholdNotification.css";

interface Props {
  archivingThresholdMs: number;
}

export const ArchivedCommentsThresholdNotification: FunctionComponent<
  Props
> = ({ archivingThresholdMs }) => {
  const seconds = Math.floor(archivingThresholdMs / 1000);
  const { scaled, unit } = reduceSeconds(seconds, [
    TIME.DAY,
    TIME.HOUR,
    TIME.MINUTE,
  ]);

  return (
    <Localized
      id="profile-commentHistory-archived-thisIsAllYourComments"
      vars={{ value: scaled, unit }}
    >
      <div className={styles.text}>
        This is all of your comments from the previous {scaled} {unit}. To view
        the rest of your comments, please contact us.
      </div>
    </Localized>
  );
};
