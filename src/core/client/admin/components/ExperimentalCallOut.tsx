import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { LabFlaskExperimentIcon, SvgIcon } from "coral-ui/components/icons";
import { CallOut, Flex } from "coral-ui/components/v2";

import styles from "./ExperimentalCallOut.css";

interface ExperimentalCallOutProps {
  children?: React.ReactNode;
}

const ExperimentalCallOut: FunctionComponent<ExperimentalCallOutProps> = ({
  children,
}) => (
  <CallOut color="primary" fullWidth>
    <Flex>
      <SvgIcon
        className={styles.icon}
        size="md"
        Icon={LabFlaskExperimentIcon}
      />
      <Localized id="configure-experimentalFeature">
        <span className={styles.title}>Experimental Feature</span>
      </Localized>
    </Flex>
    <span>{children}</span>
  </CallOut>
);

export default ExperimentalCallOut;
