import React, { FunctionComponent } from "react";

import { Step, StepBar } from "coral-ui/components/v2";

import styles from "./PageStepBar.css";

interface Props {
  step: number;
}

const PageStepBar: FunctionComponent<Props> = ({ step }) => {
  return (
    <div>
      <StepBar currentStep={step} className={styles.stepBar}>
        <Step classes={{ line: styles.line }} />
        <Step classes={{ line: styles.line }} />
        <Step classes={{ line: styles.line }} />
        <Step classes={{ line: styles.line }} />
      </StepBar>
    </div>
  );
};

export default PageStepBar;
