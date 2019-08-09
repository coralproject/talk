import React, { FunctionComponent } from "react";

import { Step, StepBar } from "coral-ui/components";

import styles from "./PageStepBar.css";

interface Props {
  step: number;
}

const PageStepBar: FunctionComponent<Props> = ({ step }) => {
  return (
    <div>
      <StepBar currentStep={step} className={styles.stepBar}>
        <Step lineClassName={styles.line}>{""}</Step>
        <Step lineClassName={styles.line}>{""}</Step>
        <Step lineClassName={styles.line}>{""}</Step>
        <Step lineClassName={styles.line}>{""}</Step>
      </StepBar>
    </div>
  );
};

export default PageStepBar;
