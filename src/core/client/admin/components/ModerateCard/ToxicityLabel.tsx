import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Counter, Typography } from "coral-ui/components";

import styles from "./ToxicityLabel.css";

const ToxicityCounter: FunctionComponent<{ score: number }> = ({ score }) => (
  <Counter>{Math.round(score * 100)}%</Counter>
);

const ToxicityLabel: FunctionComponent<{
  score: number;
  threshold: number;
}> = ({ score, threshold }) => {
  const counter = <ToxicityCounter score={score} />;

  if (score > threshold) {
    return (
      <Localized id="moderate-toxicityLabel-likely" score={counter}>
        <Typography
          className={styles.root}
          variant="bodyCopy"
          color="errorDark"
        >
          Likely
        </Typography>
      </Localized>
    );
  } else if (score <= 0.5) {
    return (
      <Localized id="moderate-toxicityLabel-unlikely" score={counter}>
        <Typography className={styles.root}>Unlikely</Typography>
      </Localized>
    );
  }

  return (
    <Localized id="moderate-toxicityLabel-maybe" score={counter}>
      <Typography className={styles.root}>Maybe</Typography>
    </Localized>
  );
};

export default ToxicityLabel;
