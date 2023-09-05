import React, { FunctionComponent } from "react";

import { RemoveCircleIcon, SvgIcon } from "coral-ui/components/icons";

import styles from "./RejectedIcon.css";

const RejectedIcon: FunctionComponent = () => (
  <SvgIcon
    size="md"
    className={styles.root}
    data-testid="rejected-icon"
    Icon={RemoveCircleIcon}
  />
);

export default RejectedIcon;
