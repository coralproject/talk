import React, { FunctionComponent } from "react";

import { CheckCircleIcon, SvgIcon } from "coral-ui/components/icons";

import styles from "./ApprovedIcon.css";

const ApprovedIcon: FunctionComponent = () => (
  <SvgIcon
    size="md"
    className={styles.root}
    data-testid="approved-icon"
    Icon={CheckCircleIcon}
  />
);

export default ApprovedIcon;
