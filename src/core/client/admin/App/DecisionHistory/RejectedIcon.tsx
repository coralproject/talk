import React, { FunctionComponent } from "react";

import { CloseCircleIcon, SvgIcon } from "coral-ui/components/icons";

import styles from "./RejectedIcon.css";

const RejectedIcon: FunctionComponent = () => (
  <SvgIcon
    size="md"
    className={styles.root}
    data-testid="rejected-icon"
    Icon={CloseCircleIcon}
  />
);

export default RejectedIcon;
