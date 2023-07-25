import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { AlertCircleIcon, SvgIcon } from "coral-ui/components/icons";
import { CallOut } from "coral-ui/components/v3";

import styles from "./Sorry.css";

const Sorry: FunctionComponent = () => {
  return (
    <CallOut
      color="error"
      icon={<SvgIcon Icon={AlertCircleIcon} className={styles.alertIcon} />}
      titleWeight="semiBold"
      title={
        <Localized id="download-landingPage-sorry">
          Your download link is invalid.
        </Localized>
      }
    />
  );
};

export default Sorry;
